import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { faCss3Alt, faHtml5, faJs, faNode } from '@fortawesome/free-brands-svg-icons';
import { Subscription } from 'rxjs';
import { CALLBACK_RESPONSE, CustomIntersectionObserverService } from 'src/app/services/custom-intersection-observer.service';
import { LangService } from 'src/app/services/lang.service';

interface LANGOPTIONS {
  [key: string]: string
}

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    providers: [CustomIntersectionObserverService],
    standalone: false
})
export class AboutComponent {
  faJs = faJs;
  faCss3Alt = faCss3Alt;
  faHtml5 = faHtml5;
  faNode = faNode;
  
  @ViewChild('imageEnlargeWrapper') imageEnlargerWrapper: ElementRef;
  intersectionSubscription: Subscription;

  constructor(
    private langService: LangService,
    private intersectionObserver: CustomIntersectionObserverService,
    private titleService: Title
  ){
    this.langService.langEvents.subscribe(() => this.setTitle());
    this.setTitle();
  }

  ngAfterViewInit(){
    //underline trigger
    this.intersectionSubscription =  this.intersectionObserver
      .observe(document.querySelectorAll('.ChapterHeader'))
      .subscribe(this.onIntersect);
  }
  ngOnDestroy(){
    this.intersectionSubscription.unsubscribe();
  }

  showEnlargeImage(src: string){
    this.imageEnlargerWrapper.nativeElement.querySelector('img').src = src;
    this.imageEnlargerWrapper.nativeElement.querySelector('img').style.backgroundColor = 'var(--color-dark)';
    this.imageEnlargerWrapper.nativeElement.style.display = 'block';

    let elt = this.imageEnlargerWrapper.nativeElement;
    while(elt.tagName !== "BODY") elt = elt.parentElement;
    elt.style.overflow = 'hidden';
    elt.style.paddingRight = (window.innerWidth - document.documentElement.clientWidth) + 'px';
  }
  hideEnlargedImage(e: MouseEvent){
    if((e.target as Element).tagName === 'IMG') {
      let style = (((e.target as any).style) as CSSStyleDeclaration);
      let last_color = style.backgroundColor;
      style.backgroundColor = last_color === '' || last_color === 'var(--color-dark)' ? 'white' : 'var(--color-dark)';
      return;
    }

    this.imageEnlargerWrapper.nativeElement.style.display = 'none';

    let elt = this.imageEnlargerWrapper.nativeElement;
    while(elt.tagName !== "BODY") elt = elt.parentElement;
    elt.style.overflow = 'unset';
    elt.style.paddingRight = 'unset';
  }

  onIntersect(entries: Array<CALLBACK_RESPONSE>){
    entries.forEach((entry) => {
      if(entry.intersect) entry.elt.classList.add('visible');
      else entry.elt.classList.remove('visible');
    });
  }

  setTitle() {
    const translations: LANGOPTIONS = {
      'de': 'Über mich',
      'en': 'About me'
    };
    this.titleService.setTitle(translations[this.lang] + " - Tim Klenk.de");
  }

  get lang() {
    return this.langService.lang;
  }
}
