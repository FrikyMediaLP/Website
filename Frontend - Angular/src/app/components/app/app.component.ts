import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LangService } from 'src/app/services/lang.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  routerEvents: Subscription;

  constructor(private langService: LangService, public router: Router){ }
  ngOnInit(){
    //Language
    const LANGS = [
      this.langService.getStorageLanguage(),
      navigator.language.split('-')[0]
    ];

    for(let lang of LANGS){
      if(this.langService.langs.find(elt => elt === lang)) {
        this.langService.setLanguage(lang);
        break;
      }
    }
  }
  ngOnDestroyed(){
    this.routerEvents.unsubscribe();
  }
}
