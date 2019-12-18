import { Injectable, Compiler, Injector, NgModuleRef, NgModule, ViewContainerRef, ModuleWithComponentFactories, Component, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { MetaInfo } from '../metainfo.model';
import { InsertionDynDirective } from '../insertion-dyn.directive';
import { DynComponent } from './dyn.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AOTProjectionService {
  componentRef: ComponentRef<any>[] = []
  componentsSubscriptions: Subscription[] = []

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

  loadComponents(metainfo: MetaInfo[], vcrs: ViewContainerRef[]) {

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
