import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  @Input() name: string;
  @Input() info: string;
  @Input() color: any;
  @Input() video: string;
  @Input() format: 'vertical' | 'horizontal' = "horizontal";
  @Input() playbackRate: number = 1;
  @Input() link: string;
  @Input() icon: IconDefinition;
  @Input() alternateIcon: IconDefinition;
  @Input() icon_URL: string;

  @ViewChild('videoRef') videoRef: ElementRef;

  firstItteration: boolean = true;
  useAlternateIcon: boolean = false;

  ngAfterViewInit() {
    if(!this.alternateIcon) return;

    setInterval(() => {
      this.firstItteration = false;
      this.useAlternateIcon = this.useAlternateIcon === false;
    }, ALTERNATE_DELAY);
  }

  replayVideo() {
    if(!this.videoRef) return;
    this.videoRef.nativeElement.muted = true;
    this.videoRef.nativeElement.play();
    this.videoRef.nativeElement.currentTime = 0;
    this.videoRef.nativeElement.playbackRate = this.playbackRate;
  }
  videoError(e: ErrorEvent){
    console.log(e)
    let s = (e.target as Element).innerHTML;

    (e.target as Element).innerHTML = s;

    (e.target as any).play();
  }
}