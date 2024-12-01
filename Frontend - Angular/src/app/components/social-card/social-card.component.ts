import { Component, ElementRef, Input, input, viewChild } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
export interface Color {
  image?: string;
  color?: string;
}

const ALTERNATE_DELAY = 10000;

@Component({
    selector: 'app-social-card',
    templateUrl: './social-card.component.html',
    styleUrls: ['./social-card.component.css'],
    standalone: false
})
export class SocialCardComponent {
  readonly name = input<string>();
  readonly info = input<string>();
  readonly color = input<any>();
  readonly video = input<string>();
  readonly format = input<'vertical' | 'horizontal'>("horizontal");
  readonly playbackRate = input<number>(1);
  readonly link = input<string>();
  readonly icon = input<IconDefinition>();
  readonly alternateIcon = input<IconDefinition>();
  readonly icon_URL = input<string>();

  readonly videoRef = viewChild<ElementRef>('videoRef');

  firstItteration: boolean = true;
  useAlternateIcon: boolean = false;

  ngAfterViewInit() {
    if(!this.alternateIcon()) return;

    setInterval(() => {
      this.firstItteration = false;
      this.useAlternateIcon = this.useAlternateIcon === false;
    }, ALTERNATE_DELAY);
  }

  replayVideo() {
    const videoRef = this.videoRef();
    if(!videoRef) return;
    videoRef.nativeElement.muted = true;
    videoRef.nativeElement.play();
    videoRef.nativeElement.currentTime = 0;
    videoRef.nativeElement.playbackRate = this.playbackRate();
  }
  videoError(e: ErrorEvent){
    console.log(e)
    let s = (e.target as Element).innerHTML;

    (e.target as Element).innerHTML = s;

    (e.target as any).play();
  }
}