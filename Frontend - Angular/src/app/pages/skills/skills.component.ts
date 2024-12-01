import { Component, ElementRef, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { faJs, faCss3Alt, faHtml5, faNode, faJava, faGitAlt, faPython, faAngular, faVuejs, faReact, faLinux, faPhp, faTypo3 } from '@fortawesome/free-brands-svg-icons';
import { LangService } from 'src/app/services/lang.service';

@Component({
    selector: 'app-skills',
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.css'],
    standalone: false
})
export class SkillsComponent {
  faJs = faJs;
  faCss3Alt = faCss3Alt;
  faHtml5 = faHtml5;
  faNode = faNode;
  faJava = faJava;
  faGitAlt = faGitAlt;
  faPython = faPython;
  faAngular = faAngular;
  faVuejs = faVuejs;
  faReact = faReact;
  faLinux = faLinux;
  faPhp = faPhp;
  faTypo3 = faTypo3;
  
  readonly hint = viewChild<ElementRef>('skillelevelhint');
  
  scroll2Hint(){
    this.hint().nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  constructor(
    private langService: LangService,
    private titleService: Title
  ) {
    this.langService.langEvents.subscribe(() => this.setTitle());
    this.setTitle();
  }

  setTitle() {
    this.titleService.setTitle("Skills - Tim Klenk.de");
  }

  get lang() {
    return this.langService.lang;
  }
}
