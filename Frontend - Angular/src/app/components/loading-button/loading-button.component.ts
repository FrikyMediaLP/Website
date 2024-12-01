import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-loading-button',
    templateUrl: './loading-button.component.html',
    styleUrls: ['./loading-button.component.css'],
    standalone: false
})
export class LoadingButtonComponent {
  readonly type = input<string>(null);
  readonly disabled = input<boolean>(false);
  readonly onClickEvent = output<MouseEvent>({ alias: 'onClick' });
  loading: boolean = false;

  onClick(e: MouseEvent){
    if(this.disabled()) return;
    if(this.loading) return;

    //click animation
    (e.target as HTMLElement).style.setProperty('--x', e.offsetX + 'px');
    (e.target as HTMLElement).style.setProperty('--y', e.offsetY + 'px');

    (e.target as HTMLElement).classList.add('click');
    setTimeout(() => {
      (e.target as HTMLElement).classList.remove('click');
    }, 1000);

    //loading ring
    this.loading = true;
    
    this.onClickEvent.emit(e);
  }
}
