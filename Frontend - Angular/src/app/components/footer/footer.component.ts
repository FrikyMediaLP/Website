import { Component } from '@angular/core';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(private langService: LangService) {}

  setLang(_lang: string){
    this.langService.setLanguage(_lang, true);
  }
  
  get lang_info() {
    return this.langService.lang_info;
  }
  get lang() {
    return this.langService.lang;
  }
}
