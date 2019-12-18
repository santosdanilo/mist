import { ViewChild } from "@angular/core";
import { InsertionDynDirective } from '../insertion-dyn.directive';

export abstract class DynComponent {
    @ViewChild(InsertionDynDirective, { static: true }) child: InsertionDynDirective;
}