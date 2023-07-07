import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
export interface Color {
  image?: string;
  color?: string;
}

@Component({
  selector: 'app-social-card',
  templateUrl: './social-card.component.html',
  styleUrls: ['./social-card.component.css']
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
  @Input() icon_URL: string;

  @ViewChild('videoRef') videoRef: ElementRef;

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