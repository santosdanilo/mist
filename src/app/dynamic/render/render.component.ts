import { Component, OnInit, ViewChildren, AfterViewInit, OnDestroy, ComponentFactoryResolver, Type, ComponentRef, ChangeDetectorRef, ViewContainerRef, Input } from '@angular/core';
import { InsertionDirective } from '../insertion.directive';
import { CloudComponent } from 'src/app/cloud/cloud.component';
import { RainyComponent } from 'src/app/rainy/rainy.component';
import { MetaInfo } from '../metainfo.model';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss']
})
export class RenderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(InsertionDirective) children: InsertionDirective[];
  public componentsRef: ComponentRef<any>[] = [null, null]
  @Input() metainfo: MetaInfo[];

  constructor(private cfr: ComponentFactoryResolver, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadChildrenComponent()
    this.cd.detectChanges()
  }

  loadChildrenComponent(): void {
    const viewContainerRef = this.children.map(c => c.viewContainerRef)
    this.metainfo.forEach((info, index) => {
      let component = this.loadChildComponent(info.component, viewContainerRef[index])
      component = this.setChildComponentInput(component, info.inputs)
      this.componentsRef[index] = component
    });
  }

  loadChildComponent<T>(componentType: Type<T>, viewContainerRef: ViewContainerRef) {
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
    if (this.componentsRef.length) {
      this.componentsRef.forEach(c => c.destroy())
    }
  }

}
