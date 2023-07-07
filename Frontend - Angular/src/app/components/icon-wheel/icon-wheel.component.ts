import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface ICON {
  title: string,
  icon_url?: string,
  icon_fa?: IconProp,
  link?: string,
  router_link?: string,
  color: string
}

const DURATION = 60;

@Component({
  selector: 'app-icon-wheel',
  templateUrl: './icon-wheel.component.html',
  styleUrls: ['./icon-wheel.component.css']
})
export class IconWheelComponent {
  @ViewChild('wrapper') wrapperRef: ElementRef;
  @Input() center: ICON = null;
  @Input() icons: Array<ICON> = [];

  slow: boolean = false;
  duration: number = DURATION;
  last: number = null;
  pos: number = 0;

  ngAfterViewInit() {
    window.requestAnimationFrame((timestamp) => this.animate(timestamp));
  }
  animate(timestamp: number) {
    const elapsed = timestamp - this.last;
    this.last = timestamp;

    if(elapsed > 1000) {
      window.requestAnimationFrame((timestamp) => this.animate(timestamp));
      return;
    }

    //ease in / out
    if(this.slow) {
      this.duration = this.duration + elapsed;

      if(this.duration > 300) this.duration = 5000000;
    }
    else {
      if(this.duration > 500) this.duration = 100;
      this.duration = Math.max(DURATION, this.duration - elapsed);
    }

    //rotate
    let last_pos = this.pos;
    this.pos += elapsed / this.duration;
  
    //clamp to 0-360
    if(this.pos > 360) this.pos = 0;

    //animate between steps
    this.wrapperRef.nativeElement.animate([
      { '--phi_offset': last_pos },
      { '--phi_offset': this.pos }
    ], {
      duration: elapsed * 2,
      iterations: 1
    });

    //retrigger callback
    window.requestAnimationFrame((timestamp) => this.animate(timestamp));
  }
}
