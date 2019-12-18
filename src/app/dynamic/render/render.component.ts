import {
  Component,
  OnInit,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { InsertionDirective } from '../insertion.directive';
import { MetaInfo } from '../metainfo.model';
import { JITProjectionService } from '../services/jit.service';
import { AOTProjectionService } from '../services/aot.service';

@Component({
  selector: 'app-render',
  template: `
    <ng-container *ngFor="let comp of metainfo">
      <ng-template appInsertion></ng-template>
    </ng-container>
  `,
  styleUrls: ['./render.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChildren(InsertionDirective) children: InsertionDirective[];

  @Input() metainfo: MetaInfo[];

  constructor(private cfr: ComponentFactoryResolver, private cd: ChangeDetectorRef, private aot: AOTProjectionService) { }

  ngOnInit(): void { }

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
    const viewContainerRef = this.children.map(c => c.vcr)
    this.aot.loadComponents(this.metainfo, viewContainerRef)
    this.cd.detectChanges()
  }

  removeChildrenComponent(): void {
    this.aot.destroyComponents()
    this.cd.detectChanges()
  }

  ngOnDestroy(): void {
    this.removeChildrenComponent()
  }

}
