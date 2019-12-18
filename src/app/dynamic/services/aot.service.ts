import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentRef, EventEmitter, Type } from '@angular/core';
import { MetaInfo, MetaInfoInterface, MetaInfoOutput } from '../metainfo.model';
import { Subscription } from 'rxjs';
import { Projection } from './projection';

@Injectable({
  providedIn: 'root'
})
export class AOTProjectionService implements Projection {
  componentRef: ComponentRef<any>[] = []
  componentsSubscriptions: Subscription[] = []

  constructor(private cfr: ComponentFactoryResolver) { }

  loadComponents(metainfo: MetaInfo[], vcrs: ViewContainerRef[]) {
    this.componentRef = metainfo.map((info, index) => {
      let component = this.createComponent(info.component, vcrs[index])
      component = this.setComponentInput(component, info.inputs)
      component = this.setComponentOutput(component, info.outputs)
      return component
    });
  }

  createComponent<T>(componentType: Type<T>, viewContainerRef: ViewContainerRef) {
    const componentFactory = this.cfr.resolveComponentFactory<T>(componentType)
    const component = viewContainerRef.createComponent<T>(componentFactory)
    return component
  }

  private setComponentInput<T>(component: ComponentRef<T>, input: MetaInfoInterface) {
    if (!!input) {
      Object.keys(input.value).forEach(key => {
        if (key in component.instance || !!input.force) {
          component.instance[key] = input.value[key]
        }
      })
    }
    return component
  }

  private setComponentOutput<T>(component: ComponentRef<T>, output: MetaInfoOutput) {
    if (!!output) {
      Object.keys(output.value).forEach(key => {
        if (key in component.instance || !!output.force) {
          this.componentsSubscriptions.push(
            (component.instance[key] as EventEmitter<any>).subscribe(
              output.value[key].success,
              output.value[key].fail,
              output.value[key].complete)
          )
        }
      })
    }
    return component
  }

  destroyComponents() {
    if (this.componentsSubscriptions.length) {
      this.componentsSubscriptions.forEach(s => s.unsubscribe())
    }
    if (this.componentRef && this.componentRef.length > 0) {
      this.componentRef.forEach(c => c.destroy())
    }
  }
}
