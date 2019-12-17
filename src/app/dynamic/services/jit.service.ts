import { Injectable, Compiler, Injector, NgModuleRef, NgModule, ViewContainerRef, ModuleWithComponentFactories } from '@angular/core';
import { MetaInfo } from '../metainfo.model';

@Injectable({
  providedIn: 'root'
})
export class JitService {
  constructor(private compiler: Compiler, private injector: Injector, private module: NgModuleRef<any>) { }

  compileComponent(tmpModule: any): Promise<ModuleWithComponentFactories<any>> {
    return this.compiler.compileModuleAndAllComponentsAsync(tmpModule)
  }

  createTempModule(components: MetaInfo[]) {
    const d = Array.from(new Set(components.map(c => c.component)))
    return NgModule({ declarations: d })(class { })
  }

  async loadComponents(components: MetaInfo[]) {
    const vcrs: ViewContainerRef[] = []
    const m = this.createTempModule(components)
    try {
      const factories = await this.compileComponent(m)
      console.log(factories)

    } catch (error) {

    }
  }
}
