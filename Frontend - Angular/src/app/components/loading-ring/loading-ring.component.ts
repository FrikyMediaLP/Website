import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-ring',
  templateUrl: './loading-ring.component.html',
  styleUrls: ['./loading-ring.component.css']
})
export class LoadingRingComponent {
  @Input() size: number = 1;
}
