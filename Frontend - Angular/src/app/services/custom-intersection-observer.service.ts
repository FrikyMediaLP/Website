import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, fromEvent } from 'rxjs';

export interface CALLBACK_RESPONSE { 
  elt: HTMLElement, 
  intersect: boolean
};

interface OBSERVING { 
  elements: NodeListOf<Element>,
  subject: BehaviorSubject<Array<CALLBACK_RESPONSE>>
};

@Injectable()
export class CustomIntersectionObserverService {
  observers: Array<OBSERVING> = [];
  eventSubscription: Subscription;
  
  constructor() {
    this.eventSubscription = fromEvent(window, "scroll").subscribe(e => {
      this.onWindowScroll();
    });
  }
  ngOnDestroy(){
    this.eventSubscription?.unsubscribe();
  }

  onWindowScroll(){
    let windowHeight = document.querySelector('html').clientHeight;
    
    for(let obs of this.observers) {
      let entries: Array<CALLBACK_RESPONSE> = [];

      obs.elements.forEach((elt) => {
        let rect = elt.getBoundingClientRect();
        entries.push({ 
          elt: elt as HTMLElement, 
          intersect: rect.top - windowHeight < 0 && rect.top - windowHeight > -windowHeight
        });
      });

      obs.subject.next(entries);
    }
  }
  
  observe(elts: NodeListOf<Element>) {
    let subject = new BehaviorSubject<Array<CALLBACK_RESPONSE>>([]);

    this.observers.push({
      elements: elts,
      subject: subject
    });

    this.bump();
    return subject;
  }
  bump(){
    this.onWindowScroll();
  }
}
