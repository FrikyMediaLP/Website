import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface LANGUAGE_INFO {
  name: string,
  title: string,
  icon: string
}

@Injectable({
  providedIn: 'root'
})
export class LangService {
  lang_info: LANGUAGE_INFO[] = [
    { 
      name: 'de',
      title: 'Deutsch',
      icon: 'de'
    },
    { 
      name: 'en',
      title: 'English',
      icon: 'us'
    }
  ];
  langs: string[] = this.lang_info.map(elt => elt.name);
  lang: string = this.langs[0];
  langEvents = new Subject<string>();
  _storage_location: string = 'lang';

  setStorageLanguage(_lang: string) {
    localStorage.setItem(this._storage_location, this.lang);
  }
  getStorageLanguage() {
    return localStorage.getItem(this._storage_location);
  }
 
  setLanguage(_lang: string, store: boolean = false) {
    if(this.langs.find(elt => elt === _lang)) this.lang = _lang;
    if(store) this.setStorageLanguage(this.lang);
    this.langEvents.next(this.lang);
  }
  nextLanguage(store: boolean = false){
    this.setLanguage(this.lang === 'de' ? 'en' : 'de', store);
  }
}
