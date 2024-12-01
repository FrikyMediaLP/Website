import { Component, input } from '@angular/core';

@Component({
    selector: 'app-loading-ring',
    templateUrl: './loading-ring.component.html',
    styleUrls: ['./loading-ring.component.css'],
    standalone: false
})
export class LoadingRingComponent {
  readonly size = input<number>(1);
}
