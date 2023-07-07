import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  styleUrls: ['./project-summary.component.css']
})
export class ProjectSummaryComponent {
  @Input() name: string = '';
  @Input() headersize: number = 1;
  @Input() title: LANGUAGE = {};
  @Input() description: LANGUAGES = {};
  @Input() img: string = '';
  @Output('onImageClick') onImageClick = new EventEmitter<MouseEvent>();
  @Input() color: string = '';
  @Input() link: string = '';

  constructor(private langService: LangService) {}

  imageClick(e: MouseEvent){
    this.onImageClick.emit(e);
  }
  get lang() {
    return this.langService.lang;
  }
}
