import { Component, ElementRef, Input, input, viewChild } from '@angular/core';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.css'],
    standalone: false
})
export class VideoComponent {
  playing: boolean = true;
  readonly lazy = input<boolean>(false);
  readonly source = input<string>();
  readonly options = input<Array<string>>([]);
  readonly fullscreen = input<boolean>(false);
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() static: boolean = false;
  readonly is_static = input<boolean>(false);
  readonly video = viewChild<ElementRef>('video');
  readonly img = viewChild<ElementRef>('img');

  poster: string = null;

  ngOnInit(){
    this.selectStatic();
  }

  selectStatic(){
    const DURATION = 500;

    let last = this.poster;
    const img = this.img();
    if(!img) {
      while(last === this.poster) this.poster = this.options()[Math.floor((this.options().length * Math.random()) + 1) - 1];
      return;
    };

    img.nativeElement.animate([
      { 'opacity': 1 },
      { 'opacity': 0 }
     ], {
      duration: DURATION,
      iterations: 1,
    });

    setTimeout(() => {
      while(last === this.poster) this.poster = this.options()[Math.floor((this.options().length * Math.random()) + 1) - 1];
    
      this.img().nativeElement.animate([
        { 'opacity': 0 },
        { 'opacity': 1 }
       ], {
        duration: DURATION,
        iterations: 1,
      });
    }, DURATION);
  }

  play(){
    if(!this.source()) return;
    if(!this.playing) this.video().nativeElement.play();
    this.playing = true;
  }
  pause(){
    if(!this.source()) return;
    if(this.playing) this.video().nativeElement.pause();
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
