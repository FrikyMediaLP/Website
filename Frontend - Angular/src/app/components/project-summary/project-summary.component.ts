import { Component, Input, input, output } from '@angular/core';
import { LangService } from 'src/app/services/lang.service';

interface LANGUAGE {
  [key: string]: string
}

interface LANGUAGES {
  [key: string]: string[]
}

@Component({
    selector: 'app-project-summary',
    templateUrl: './project-summary.component.html',
    styleUrls: ['./project-summary.component.css'],
    standalone: false
})
export class ProjectSummaryComponent {
  readonly name = input<string>('');
  readonly headersize = input<number>(1);
  readonly title = input<LANGUAGE>({});
  readonly description = input<LANGUAGES>({});
  readonly img = input<string>('');
  readonly onImageClick = output<MouseEvent>({ alias: 'onImageClick' });
  readonly color = input<string>('');
  readonly link = input<string>('');

  constructor(private langService: LangService) {}

  imageClick(e: MouseEvent){
    this.onImageClick.emit(e);
  }
  get lang() {
    return this.langService.lang;
  }
}
