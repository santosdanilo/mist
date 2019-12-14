import {
  Component,
  OnInit,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  ComponentFactoryResolver,
  Type,
  ComponentRef,
  ChangeDetectorRef,
  ViewContainerRef,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  EventEmitter,
  Renderer2
} from '@angular/core';
import { InsertionDirective } from '../insertion.directive';
import { MetaInfo, MetaInfoInterface, MetaInfoOutput } from '../metainfo.model';
import { Subscription } from 'rxjs';
import { AlterDirective } from '../alter.directive';

@Component({
  selector: 'app-render',
  template: `
    <ng-container *ngFor="let comp of metainfo">
      <ng-template appInsertion appAlter></ng-template>
    </ng-container>
  `,
  styleUrls: ['./render.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChildren(InsertionDirective) children: InsertionDirective[];

  @Input() metainfo: MetaInfo[];

  public componentsRef: ComponentRef<any>[];
  public componentsSubscriptions: Subscription[];

  constructor(private cfr: ComponentFactoryResolver, private cd: ChangeDetectorRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.componentsSubscriptions = []
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
    if (this.componentsSubscriptions.length) {
      this.componentsSubscriptions.forEach(s => s.unsubscribe())
    }
    if (this.componentsRef.length) {
      this.componentsRef.forEach(c => c.destroy())
    }
    this.cd.detectChanges()
  }

  createChildrenComponent<T>(): ComponentRef<T>[] {
    const viewContainerRef = this.children.map(c => c.vcr)
    return this.metainfo.map((info, index) => {
      let component = this.createChildComponent(info.component, viewContainerRef[index])
      component = this.setChildComponentInput(component, info.inputs)
      component = this.setChildComponentOutput(component, info.outputs)
      return component
    });
  }

  createChildComponent<T>(componentType: Type<T>, viewContainerRef: ViewContainerRef) {
    const componentFactory = this.cfr.resolveComponentFactory<T>(componentType)
    const component = viewContainerRef.createComponent<T>(componentFactory)
    console.log(this.renderer.createElement('div'))
    //viewContainerRef.createComponent()
    //const d = new AlterDirective(viewContainerRef)
    //console.log(d)
    return component
  }

  setChildComponentInput<T>(component: ComponentRef<T>, input: MetaInfoInterface) {
    if (!!input) {
      Object.keys(input.value).forEach(key => {
        if (key in component.instance || !!input.force) {
          component.instance[key] = input.value[key]
        }
      })
    }
    return component
  }

  setChildComponentOutput<T>(component: ComponentRef<T>, output: MetaInfoOutput) {
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

  ngOnDestroy(): void {
    this.removeChildrenComponent()
  }

}
