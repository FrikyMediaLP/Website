import { Component, Input, Output, ViewChild, ElementRef, ViewEncapsulation, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { LangService } from 'src/app/services/lang.service';

export interface PROJECT {
  name: LANGOPTIONS,
  hash?: string,
  status: number,
  start: string,
  end: string,
  details?: Array<PROJECT_SECTION>,
  active?: boolean,
  show?: boolean,
  custom_html?: PROJECT_HTML
}

export interface PROJECT_HTML {
  html?: string,
  style?: string,
  script?: string,
  scripts?:  Array<string>
}

export interface PROJECT_SECTION {
  title: LANGOPTIONS,
  p: Array<LANGOPTIONS>,
  image?: 'left' | 'right',
  image_url?: string,
  video_url?: string,
  image_width?: string,
  image_alt?: LANGOPTIONS,
  image_title?: LANGOPTIONS,
  images?: Array<PROJECT_SECTION_IMAGE>,
  images_mode?: 'width' | 'height'
}

export interface LANGOPTIONS {
  [key: string]: string
}

export interface PROJECT_SECTION_IMAGE {
  url: string,
  width?: string,
  alt?: LANGOPTIONS,
  title?: LANGOPTIONS
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectComponent implements OnInit, AfterViewInit {
  @Input() project: PROJECT;
  @Output() onImageEnlarge = new EventEmitter();
  @Output() onShowToggle = new EventEmitter();
  @ViewChild('wrapper') wrapper: ElementRef<HTMLDivElement>;

  name: LANGOPTIONS;
  hash: string;
  status: number;
  start: string;
  end: string;
  details: Array<PROJECT_SECTION>;
  custom_html: PROJECT_HTML;
  active: boolean;
  show: boolean;
  loaded_custom_html: boolean = false;
  render_custom_html: boolean;

  constructor(private langService: LangService) {}
  ngOnInit() {
    this.name = this.project.name;
    this.hash = this.project.hash;
    this.status = this.project.status;
    this.start = this.project.start;
    this.end = this.project.end;
    this.details = this.project.details;
    this.custom_html = this.project.custom_html;
    this.active = this.project.active;
    this.show = this.project.show;
  }
  ngAfterViewInit() {
    if(this.show) this.showProject();
    if(this.render_custom_html) this.loadCustomHTML();
  }
  loadCustomHTML(){
    if(this.loaded_custom_html) return;
    let scripts: Array<string> = [];

    if(this.custom_html?.script) scripts.push(this.custom_html?.script);

    if(this.custom_html?.scripts) scripts = scripts.concat(this.custom_html?.scripts);

    document.querySelectorAll('head script').forEach((x: Element) => {
      scripts = scripts.filter(elt => elt !== x.getAttribute('src'));
    });

    for(let script of scripts || []){
      let node = document.createElement('script');
      node.src = script;
      node.type = 'text/javascript';
      node.async = true;
      document.getElementsByTagName('head')[0].appendChild(node);
    }

    if(this.custom_html?.style) {
      let node = document.createElement('link');
      node.href = this.custom_html.style;
      node.rel = 'stylesheet';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
    
    this.loaded_custom_html = true;
  }

  toggleProject(e: Event){
    //DETECT VALID TOGGLE
    if((e as any).charCode && (e as any).charCode !== 13) return;

    let parent = (e.currentTarget  as Element).parentElement;

    while(!parent.classList.contains('Project') && parent.tagName !== 'BODY') {
      parent = parent.parentElement;
    }

    if(!parent.classList.contains('Project')) return;

    parent.classList.toggle('show');

    let detailsElt = parent.querySelector('.ProjectDetails');

    let keyframes = [
      { 'maxHeight': detailsElt.scrollHeight + "px" },
      { 'maxHeight': "0" }
    ];

    if(parent.classList.contains('show')) keyframes.reverse();

    detailsElt.animate(keyframes, { 
      duration: 500,
      iterations: 1,
      fill: 'forwards'
    });

    if(parent.classList.contains('show')){
      detailsElt.animate([
        { 'maxHeight': "unset" }
      ], { 
        delay: 500,
        duration: 1,
        iterations: 1,
        fill: 'forwards'
      });

      this.wrapper.nativeElement.querySelector('.ProjectInfo').setAttribute('aria-expanded', 'true');
    } else {
      this.wrapper.nativeElement.querySelector('.ProjectInfo').setAttribute('aria-expanded', 'false');
    }

    if(parent.classList.contains('show')) this.onShowToggle.emit(this);
  }
  showProject(){
    const DURATION = 500;
    let detailsElt = this.wrapper.nativeElement.querySelector('.ProjectDetails');

    detailsElt.animate([
      { 'maxHeight': "0" },
      { 'maxHeight': detailsElt.scrollHeight + "px" }
    ], { 
      duration: DURATION,
      iterations: 1,
      fill: 'forwards'
    });

    detailsElt.animate([
      { 'maxHeight': "unset" }
    ], { 
      delay: DURATION,
      duration: 1,
      iterations: 1,
      fill: 'forwards'
    });
    
    this.wrapper.nativeElement.querySelector('.ProjectInfo').setAttribute('aria-expanded', 'true');

    let rect = this.wrapper.nativeElement.getBoundingClientRect();
    let html = (this.wrapper.nativeElement as HTMLElement);
    while(html.tagName !== "HTML") html = html.parentElement;
    html.scrollTo(0, rect.top);

    setTimeout(() => {
      let rect = this.wrapper.nativeElement.getBoundingClientRect();
      let html = (this.wrapper.nativeElement as HTMLElement);
      while(html.tagName !== "HTML") html = html.parentElement;
      html.scrollTo(0, rect.top - 100); //-100 due to navigation overlay (hides some part of the html)
    }, DURATION);
  }
  hideProject(){
    let detailsElt = this.wrapper.nativeElement.querySelector('.ProjectDetails');

    detailsElt.animate([
      { 'maxHeight': detailsElt.scrollHeight + "px" },
      { 'maxHeight': "0" }
    ], { 
      duration: 500,
      iterations: 1,
      fill: 'forwards'
    });

    this.wrapper.nativeElement.classList.remove('show');
    this.wrapper.nativeElement.querySelector('.ProjectInfo').setAttribute('aria-expanded', 'false');

  }
  
  renderHTML(){
    this.render_custom_html = true;
    this.loadCustomHTML();
  }
  unloadHTML(){
    this.render_custom_html = false;
  }

  onImageClick(url: string) {
    this.onImageEnlarge.emit(url);
  }
  videoError(e: ErrorEvent){
    console.log(e);

    let s = (e.target as Element).innerHTML;

    (e.target as Element).innerHTML = s;

    (e.target as any).play();
  }

  get lang() {
    return this.langService.lang;
  }
}