import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {
  playing: boolean = true;
  @Input() lazy: boolean = false;
  @Input() source: string;
  @Input() options: Array<string> = [];
  @Input() fullscreen: boolean = false;
  @Input() static: boolean = false;
  @ViewChild('video') video: ElementRef;
  @ViewChild('img') img: ElementRef;

  poster: string = null;

  ngOnInit(){
    this.selectStatic();
  }

  selectStatic(){
    const DURATION = 500;

    let last = this.poster;
    if(!this.img) {
      while(last === this.poster) this.poster = this.options[Math.floor((this.options.length * Math.random()) + 1) - 1];
      return;
    };

    this.img.nativeElement.animate([
      { 'opacity': 1 },
      { 'opacity': 0 }
     ], {
      duration: DURATION,
      iterations: 1,
    });

    setTimeout(() => {
      while(last === this.poster) this.poster = this.options[Math.floor((this.options.length * Math.random()) + 1) - 1];
    
      this.img.nativeElement.animate([
        { 'opacity': 0 },
        { 'opacity': 1 }
       ], {
        duration: DURATION,
        iterations: 1,
      });
    }, DURATION);
  }

  play(){
    if(!this.source) return;
    if(!this.playing) this.video.nativeElement.play();
    this.playing = true;
  }
  pause(){
    if(!this.source) return;
    if(this.playing) this.video.nativeElement.pause();
    this.playing = false;
  }
  toggle(){
    if(this.playing) this.pause();
    else this.play();
  }

  videoError(e: ErrorEvent){
    let s = (e.target as Element).innerHTML;
    (e.target as Element).innerHTML = s;

    let inter = setInterval(() => {
      if(!e.target) clearInterval(inter);
      else (e.target as any).play();
    }, 1000);
  }
}
