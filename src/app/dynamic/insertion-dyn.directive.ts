import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appInsertionDyn]'
})
export class InsertionDynDirective {

  constructor(public vcr: ViewContainerRef) {
  }

}
