import { Component, OnInit, ViewChildren, AfterViewInit, OnDestroy, ComponentFactoryResolver, Type, ComponentRef, ChangeDetectorRef, ViewContainerRef, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { InsertionDirective } from '../insertion.directive';
import { MetaInfo } from '../metainfo.model';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChildren(InsertionDirective) children: InsertionDirective[];
  public componentsRef: ComponentRef<any>[];
  @Input() metainfo: MetaInfo[];

  constructor(private cfr: ComponentFactoryResolver, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['metainfo'] && !changes['metainfo'].firstChange) {
      this.removeChildrenComponent()
      this.loadChildrenComponent()
    }
  }

  ngAfterViewInit(): void {
    this.loadChildrenComponent()
  }

  loadChildrenComponent(): void {
    this.componentsRef = this.createChildrenComponent()
    this.cd.detectChanges()
  }

  removeChildrenComponent(): void {
    if (this.componentsRef.length) {
      this.componentsRef.forEach(c => c.destroy())
    }
    this.cd.detectChanges()
  }

  createChildrenComponent<T>(): ComponentRef<T>[] {
    const viewContainerRef = this.children.map(c => c.viewContainerRef)
    return this.metainfo.map((info, index) => {
      let component = this.createChildComponent(info.component, viewContainerRef[index])
      component = this.setChildComponentInput(component, info.inputs)
      return component
    });
  }

  createChildComponent<T>(componentType: Type<T>, viewContainerRef: ViewContainerRef) {
    const componentFactory = this.cfr.resolveComponentFactory<T>(componentType)
    const component = viewContainerRef.createComponent<T>(componentFactory)
    return component
  }

  setChildComponentInput<T>(component: ComponentRef<T>, inputs: any) {
    Object.keys(inputs).forEach(key => {
      if (key in component.instance) {
        component.instance[key] = inputs[key]
      }
    })
    return component
  }

  ngOnDestroy(): void {
    this.removeChildrenComponent()
  }

}
