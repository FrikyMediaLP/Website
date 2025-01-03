import { Component, ElementRef, HostListener, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { faTwitter, faTwitch, faGithub, faYoutube, faInstagram, faDiscord, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faChevronLeft, faChevronRight, faImages, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { VideoComponent } from 'src/app/components/video/video.component';
import { CALLBACK_RESPONSE, CustomIntersectionObserverService } from 'src/app/services/custom-intersection-observer.service';
import { LangService } from 'src/app/services/lang.service';

interface LANGOPTIONS {
  [key: string]: string
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [CustomIntersectionObserverService],
    standalone: false
})
export class HomeComponent {
  faTwitter = faTwitter;
  faXTwitter = faXTwitter;
  faTwitch = faTwitch;
  faGithub = faGithub;
  faYoutube = faYoutube;
  faInstagram = faInstagram;
  faDiscord = faDiscord;

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faPause = faPause;
  faPlay = faPlay;
  faImages = faImages;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if(this.busy) {
      this.scaleAfterBusy = true;
      return;
    }
    this.scaleHeader();
  }
  readonly timRef = viewChild<ElementRef>('tim');
  readonly klenkRef = viewChild<ElementRef>('klenk');
  changeIntercval: any = null;
  busy: boolean = false;
  scaleAfterBusy: boolean = false;

  destroyEvent = new Subject<void>();
  
  readonly headerBackground = viewChild<VideoComponent>('headerBackground');
  readonly imageEnlargerWrapper = viewChild<ElementRef>('imageEnlargeWrapper');

  constructor(
    private langService: LangService,
    private intersectionObserver: CustomIntersectionObserverService,
    private titleService: Title
  ){
    this.langService.langEvents.subscribe(() => this.setTitle());
    this.setTitle();
  }

  ngAfterViewInit(){
    //Randomly change Header Text
    this.changeIntercval = setInterval(() => {
      if(Math.random() < 0.5) this.changeHeader();
    }, 20000);

    //Change Header Font Size
    this.scaleHeader();

    //underline trigger
    this.intersectionObserver
      .observe(document.querySelectorAll('.sectionsubheader'))
      .pipe(takeUntil(this.destroyEvent))
      .subscribe(this.onIntersect);

    //accent color trigger
    this.intersectionObserver
      .observe(document.querySelectorAll('section > div > p b'))
      .pipe(takeUntil(this.destroyEvent))
      .subscribe(this.onIntersect);
  }
  ngOnDestroy(){
    clearInterval(this.changeIntercval);
    this.destroyEvent.next();
    this.destroyEvent.complete();
  }

  changeHeader(){
    if(this.busy) return;
    this.busy = true;

    let text1 = this.timRef().nativeElement.innerHTML;
    let text2 = this.klenkRef().nativeElement.innerHTML;

    let text1_new = 'friky';
    let text2_new = 'media';

    if(text1 === 'friky') {
      text1_new = 'tim';
      text2_new = 'klenk';
    }

    //Clamp Image to fixed position
    if(text1.length < text1_new.length) this.timRef().nativeElement.style.minWidth = this.timRef().nativeElement.clientWidth + 'px';

    //Remove Text
    for(let i = 0; i < text2.length; i++){
      setTimeout(() => {
        this.klenkRef().nativeElement.innerHTML = text2.substring(0, text2.length - 1 - i);
      }, 100 * i);
    }

    for(let i = 0; i < text1.length; i++){
      setTimeout(() => {
        this.timRef().nativeElement.innerHTML = text1.substring(0, text1.length - 1 - i);
      }, 100 * (i + text2.length + 2));
    }
    
    //Pause / Force Height to be non zero
    setTimeout(() => {
      this.timRef().nativeElement.innerHTML = '&nbsp';
    }, 100 * (text2.length + 2 + text1.length - 1));

    //Add Text
    for(let i = 0; i < text1_new.length; i++){
      setTimeout(() => {
        this.timRef().nativeElement.innerHTML = text1_new.substring(0, i + 1);
      }, 100 * (i + text2.length + 2 + text1.length));
    }

    for(let i = 0; i < text2_new.length; i++){
      setTimeout(() => {
        this.klenkRef().nativeElement.innerHTML = text2_new.substring(0, i + 1);
      }, 100 * (i + text2.length + 2 + text1.length + text1_new.length));
    }

    //Clear
    setTimeout(() => {
      if(this.scaleAfterBusy) {
        this.scaleHeader();
        this.scaleAfterBusy = false;
      }

      this.busy = false;
      this.timRef().nativeElement.style.minWidth = 'unset';
    }, 100 * (text2.length + 2 + text1.length + text1_new.length + text2_new.length));
  }
  scaleHeader(){
    //cache text
    let cached_text = this.timRef().nativeElement.innerHTML + '';
    const timRef = this.timRef();
    timRef.nativeElement.innerHTML = 'friky';
    const klenkRef = this.klenkRef();
    klenkRef.nativeElement.innerHTML = 'media';

    let target = document.querySelector('header').clientWidth / 2;
    if(document.querySelector('header').clientWidth / document.querySelector('header').clientHeight < 1){
      //Portrait
      target = target * 1.5;
    }

    let size = 0.1;
    timRef.nativeElement.parentElement.parentElement.style.setProperty('--font', size);

    while(target > timRef.nativeElement.parentElement.clientWidth) {
      size += 0.1;
      timRef.nativeElement.parentElement.parentElement.style.setProperty('--font', size);
    }

    if(cached_text === 'tim'){
      timRef.nativeElement.innerHTML = 'tim';
      klenkRef.nativeElement.innerHTML = 'klenk';
    }
  }
  clickHeaderButton(e: MouseEvent){
    const headerBackground = this.headerBackground();
    if(e.shiftKey) {
      this.headerBackground().static = !this.headerBackground().static;
    } else if(headerBackground.static) {
      headerBackground.selectStatic();
    } else if(!headerBackground.static){
      headerBackground.toggle();
    }
  }
 
  showEnlargeImage(src: string){
    this.imageEnlargerWrapper().nativeElement.querySelector('img').src = src;
    this.imageEnlargerWrapper().nativeElement.querySelector('img').style.backgroundColor = 'var(--color-dark)';
    const imageEnlargerWrapper = this.imageEnlargerWrapper();
    imageEnlargerWrapper.nativeElement.style.display = 'block';

    let elt = imageEnlargerWrapper.nativeElement;
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

    const imageEnlargerWrapper = this.imageEnlargerWrapper();
    imageEnlargerWrapper.nativeElement.style.display = 'none';

    let elt = imageEnlargerWrapper.nativeElement;
    while(elt.tagName !== "BODY") elt = elt.parentElement;
    elt.style.overflow = 'unset';
    elt.style.paddingRight = 'unset';
  }

  frikybotHover(e: MouseEvent){
    let elt = e.target as HTMLElement;

    let x = e.offsetX;
    let y = e.offsetY;
    let rect = elt.getBoundingClientRect();
    
    let rel_X = Math.floor((x / rect.width) * 100);
    let rel_Y = Math.floor((y / rect.height) * 100);

    let mappedX =  -100 + rel_X;
    let mappedY = -100 + rel_Y;

    elt.style.setProperty('--OffsetX', mappedX + '%');
    elt.style.setProperty('--OffsetY', mappedY + '%');
  }

  onIntersect(entries: Array<CALLBACK_RESPONSE>){
    entries.forEach((entry) => {
      if(entry.intersect) entry.elt.classList.add('visible');
      else entry.elt.classList.remove('visible');
    });
  }

  setTitle() {
    this.titleService.setTitle("Tim Klenk.de");
  }

  get lang() {
    return this.langService.lang;
  }
  get headerstate() {
    const headerBackground = this.headerBackground();
    if(!headerBackground) return faImages;
    return headerBackground.static ? faImages : (headerBackground.playing ? faPause : faPlay);
  }
}