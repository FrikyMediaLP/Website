import { Component, output } from '@angular/core';

@Component({
    selector: 'app-output',
    templateUrl: './output.component.html',
    styleUrls: ['./output.component.css'],
    standalone: false
})
export class OutputComponent {
  type: 'ERROR' | 'INFO' | 'WARNING' | null = "ERROR";
  text: string | null = null;
  readonly onClickEmitter = output({ alias: 'onClick' });

  trigger(type: 'ERROR' | 'INFO' | 'WARNING', message: string){
    this.type = type;

    if(message === "") this.text = null;
    else this.text = message;
  }
  clear(){
    this.type = null;
    this.text = null;
  }
}
