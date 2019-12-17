import { Injectable, Compiler, Injector, NgModuleRef, NgModule, ViewContainerRef, ModuleWithComponentFactories, Component, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { MetaInfo } from '../metainfo.model';
import { InsertionDynDirective } from '../insertion-dyn.directive';
import { DynComponent } from './dyn.model';

@Injectable({
  providedIn: 'root'
})
export class JITProjectionService {
  componentRef: ComponentRef<any>[] = []

  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private module: NgModuleRef<any>,
    private cfr: ComponentFactoryResolver) { }

  compileComponent(tmpModule: any): Promise<ModuleWithComponentFactories<any>> {
    return this.compiler.compileModuleAndAllComponentsAsync(tmpModule)
  }

  createTempModule(components: any) {
    const d = components
    return NgModule({ declarations: [...d, InsertionDynDirective] })(
      class { }
    )
  }

  createComponent(template: string, name: string = undefined) {
    return Component({ template: `${template}`, selector: name })(class extends DynComponent { })
  }

  async loadComponents(metainfo: MetaInfo[], vcrs: ViewContainerRef[]): Promise<ComponentRef<any>[]> {
    const c = metainfo.map((c, index) => this.createComponent((c.template ? c.template : '<div></div>'), `dyn-${index}`))
    const m = this.createTempModule(c)
    try {
      const factories = await this.compileComponent(m)
      const wrapperRef = metainfo.map((m, index) => {
        const vcr = vcrs[index]
        const factory = factories.componentFactories[index]
        return vcr.createComponent<any>(factory)
      })
      const componentRef = metainfo.map((m, index) => {
        const vcr = wrapperRef[index].instance.child.vcr
        const factory = this.cfr.resolveComponentFactory(m.component)
        return vcr.createComponent(factory)
      })
      this.componentRef = [...wrapperRef, ...componentRef]
      return this.componentRef
    } catch (error) {
      console.log(error)
    }
  }

  destroyComponent() {
    // if (this.componentsSubscriptions.length) {
    //   this.componentsSubscriptions.forEach(s => s.unsubscribe())
    // }
    if (this.componentRef && this.componentRef.length > 0) {
      this.componentRef.forEach(c => c.destroy())
    }
  }
}
