import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface ICON {
  title: string,
  icon_url?: string,
  icon_fa?: IconProp,
  icon_alternative?: IconProp,
  link?: string,
  router_link?: string,
  color: string
}

const DURATION = 60;
const ALTERNATE_DELAY = 10000;

@Component({
    selector: 'app-icon-wheel',
    templateUrl: './icon-wheel.component.html',
    styleUrls: ['./icon-wheel.component.css'],
    standalone: false
})
export class IconWheelComponent {
  @ViewChild('wrapper') wrapperRef: ElementRef;
  @Input() center: ICON = null;
  @Input() icons: Array<ICON> = [];

  slow: boolean = false;
  duration: number = DURATION;
  last: number = null;
  pos: number = 0;
  firstItteration: boolean = true;
  useAlternateIcon: boolean = false;

  ngAfterViewInit() {
    window.requestAnimationFrame((timestamp) => this.animate(timestamp));
    
    setInterval(() => {
      this.firstItteration = false;
      this.useAlternateIcon = this.useAlternateIcon === false;
    }, ALTERNATE_DELAY);
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
      this.duration *= 1.01;

      if(this.duration > 300) this.duration = Infinity;
    }
    else {
      if(this.duration > 500) this.duration = 100;
      this.duration = Math.max(DURATION, this.duration - elapsed);
    }

    //rotate
    if(this.duration !== Infinity) this.pos += elapsed / this.duration;
  
    //clamp to 0-360
    if(this.pos > 360) this.pos = 0;

    this.wrapperRef.nativeElement.style.setProperty('--phi_offset', this.pos.toFixed(2));
    
    //retrigger callback
    window.requestAnimationFrame((timestamp) => this.animate(timestamp));
  }
}
