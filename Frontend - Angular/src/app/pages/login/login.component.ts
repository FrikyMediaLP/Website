import { ChangeDetectorRef, Component, ElementRef, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { OutputComponent } from 'src/app/components/output/output.component';
import { LangService } from 'src/app/services/lang.service';
import { TwitchService, USER } from 'src/app/services/twitch.service';

interface obj {
  [key: string]: Array<string>
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  readonly outputRef = viewChild<OutputComponent>('output');
  readonly linkRef = viewChild<ElementRef>('link');
  user: USER = null;
  loading: boolean = false;
  just_logged_in: boolean = false;

  faTwitch = faTwitch;
  
  constructor(
    private langService: LangService, 
    private twitch: TwitchService, 
    private router: Router, 
    private changedetector: ChangeDetectorRef,
    private titleService: Title
  ) {
    this.loading = true;

    this.twitch.getUserUpdates().subscribe((user: USER | null) => { 
      this.user = user;

      if(user) {
        this.user = user;
        if(this.just_logged_in) this.router.navigateByUrl(this.twitch.GetOrigin());
      } else {
        this.linkRef().nativeElement.href = this.twitch.GenerateLoginLink();
        this.outputRef().trigger("WARNING", {
          'de': 'Twitch Login Token Abgelaufen! Bitte neuanmelden!',
          'en': 'Twitch Login Token Expired! Please Relogin!'
        }[this.lang]);
      }

      this.loading = false;
      this.changedetector.detectChanges();
    });

    if(this.twitch.userData) {
      this.user = this.twitch.userData;
      this.loading = false;
    } else if(this.twitch.userToken) {
      this.twitch.VerifyTTVJWT(this.twitch.userToken).subscribe();
    } else {
      this.loading = false;
    }
    
    this.setTitle();
  }
  ngAfterViewInit() {
    //Login Logic
    this.outputRef().clear();
    let list : Array<string> = [];

    //extract query / hash
    if(this.router.url.startsWith('/login?')){
      let query = this.router.url.substring(this.router.url.indexOf('?') + 1);
      list = query.split('&');
    } else if(this.router.url.startsWith('/login#')){
      let hash = this.router.url.substring(this.router.url.indexOf('#') + 1);
      list = hash.split('&');
    }

    //remove hash
    window.location.hash = '';
    this.just_logged_in = true;

    //transform into key value pairs
    let response : obj = {};
    for(let elt of list){
      let splitted = elt.split('=');
      response[splitted[0]] =  decodeURIComponent(decodeURI(splitted[1])).split('+');
    }

    //detect tokens
    if(response['id_token']){
      this.loading = true;
      this.changedetector.detectChanges();
      let token = response['id_token'][0];

      //verify login state
      if(response['state'][0] === this.twitch.state){
        this.twitch.VerifyTTVJWT(token, this.twitch.nonce)
          .subscribe((response: { err?: { name: string, message: string }, user?: USER }) => {
            //login error
            if(response.err)  {
              if(response.err.name === 'HttpErrorResponse') {
                this.outputRef().trigger("ERROR", {
                  'de': 'Login fehlgeschlagen! Grund: Verifikations Service offline oder unerreichbar. Versuchen sie es nochmal später nochmal ... oder schreiben sie mir :)',
                  'en': 'Login failed! Reason: Verfication Service down or unreachable. Please try again later ... or contact me :)'
                }[this.lang]);
              } else this.outputRef().trigger("ERROR", response.err.message);
              this.linkRef().nativeElement.href = this.twitch.GenerateLoginLink();
            }
            
            this.loading = false;
          });
      } else {
        //state missmatch
        this.outputRef().trigger("ERROR", {
          'de': 'Login fehlgeschlagen! Grund: State-Abgleich fehlgeschlagen. Versuchen sie es nochmal ohne den Tab zu wechseln ... oder schreiben sie mir :)',
          'en': 'Login failed! Reason: State missmatch. Please try again without switching tabs or contact me :)'
        }[this.lang]);
        
        //reset for relogin
        this.twitch.Reset();
        this.linkRef().nativeElement.href = this.twitch.GenerateLoginLink();
        this.loading = false;
      }
    } else if(this.twitch.userToken === null) {
      //detect error
      if(response['error']){
        let token = response['error_description'].pop();
        this.outputRef().trigger("ERROR", token);
      } 

      //reset for relogin
      this.twitch.Reset();
      this.linkRef().nativeElement.href = this.twitch.GenerateLoginLink();
    }

    
    this.changedetector.detectChanges();
  }
  onMouseMove(e: MouseEvent){
    let elt = e.target as HTMLElement;

    let x = e.offsetX;
    let y = e.offsetY;
    let rect = elt.getBoundingClientRect();
    
    let rel_X = Math.floor((x / rect.width) * 100);
    let rel_Y = Math.floor((y / rect.height) * 100);

    elt.parentElement.style.setProperty('--OffsetX', rel_X + '%');
    elt.parentElement.style.setProperty('--OffsetY', rel_Y + '%');
  }
  logout(){
    this.twitch.clearUser();
    this.twitch.Reset();
    this.user = null;
    this.linkRef().nativeElement.href = this.twitch.GenerateLoginLink();
    this.outputRef().trigger("INFO", {
      'de': 'Abgemeldet!',
      'en': 'Logged out!'
    }[this.lang]);
  }

  setTitle() {
    this.titleService.setTitle("Login - Tim Klenk.de");
  }
  
  get lang(){
    return this.langService.lang;
  }
}
