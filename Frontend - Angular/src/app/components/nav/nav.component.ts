import { Component, HostListener, input } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { LangService } from 'src/app/services/lang.service';
import { TwitchService, USER } from 'src/app/services/twitch.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
    standalone: false
})
export class NavComponent {
  readonly inline = input<boolean>(false);
  scrolled: boolean = false;
  user: USER = null;
  faUser = faUser;
  expireCheckTimeout: any;

  @HostListener('window:scroll', ['$event'])
  onResize(event: Event) {
    this.scrolled = document.querySelector('html').scrollTop > 0;
  }

  constructor(private langService: LangService, private twitch: TwitchService, private router: Router) {
    //Login Change
    this.twitch.getUserUpdates().subscribe((user: USER | null) => { 
      this.user = user;

      if(user){
        console.log("Logged in time remaining: " + Math.round(((user.exp * 1000) - Date.now() + 1000) / (1000 * 60)) + 'min')

        if(this.expireCheckTimeout) clearTimeout(this.expireCheckTimeout);

        this.expireCheckTimeout = setTimeout(() => {
          this.twitch.VerifyTTVJWT(this.twitch.userToken).subscribe();
        }, Math.ceil((user.exp * 1000) - Date.now() + 1000));
      } else {
        console.log("Times up: Logged out!");
      }
    });

    //Already logged in?
    if(this.twitch.userData) {
      this.user = this.twitch.userData;
    } else if(this.twitch.userToken) {
      this.twitch.VerifyTTVJWT(this.twitch.userToken).subscribe();
    }

    //Redirect Save
    router.events.subscribe((val) => {
      if(val instanceof ResolveEnd && val.id > 1) this.twitch.SetOrigin(this.router.url);
  });
  }
  get lang(){
    return this.langService.lang;
  }
}
