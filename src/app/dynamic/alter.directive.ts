import { Directive, ViewContainerRef, TemplateRef, Renderer2, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAlter]'
})
export class AlterDirective<T> implements OnInit, AfterViewInit {

  constructor(public vcr: ViewContainerRef, public template: TemplateRef<T>) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit() {
    console.log(this.vcr)
  }

}
