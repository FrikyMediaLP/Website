import { Component, Input } from '@angular/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';

const ALTERNATE_DELAY = 10000;

@Component({
  selector: 'app-brand-icon',
  templateUrl: './brand-icon.component.html',
  styleUrls: ['./brand-icon.component.css']
})
export class BrandIconComponent {
  @Input() icon: IconDefinition;
  @Input() alternateIcon: IconDefinition;
  @Input() size: SizeProp;
  @Input() color: string = 'white';
  @Input() title: string;
  @Input() link: string;

  firstItteration: boolean = true;
  useAlternateIcon: boolean = false;

  ngAfterViewInit() {
    if(!this.alternateIcon) return;

    setInterval(() => {
      this.firstItteration = false;
      this.useAlternateIcon = this.useAlternateIcon === false;
    }, ALTERNATE_DELAY);
  }

  onMouseMove(e: MouseEvent){
    let elt = e.target as HTMLElement;

    let x = e.offsetX;
    let y = e.offsetY;
    let rect = elt.getBoundingClientRect();
    
    let rel_X = Math.floor((x / rect.width) * 100);
    let rel_Y = Math.floor((y / rect.height) * 100);

    let mappedX =  -100 + rel_X;
    let mappedY = -100 + rel_Y;

    elt.parentElement.style.setProperty('--OffsetX', mappedX + '%');
    elt.parentElement.style.setProperty('--OffsetY', mappedY + '%');
  }
}
