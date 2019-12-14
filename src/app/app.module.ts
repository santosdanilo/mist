import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlotlyViaWindowModule, PlotComponent } from 'angular-plotly.js';
import { CloudComponent } from './cloud/cloud.component';
import { InsertionDirective } from './dynamic/insertion.directive';
import { RenderComponent } from './dynamic/render/render.component';
import { RainyComponent } from './rainy/rainy.component';

@NgModule({
  declarations: [
    AppComponent,
    CloudComponent,
    InsertionDirective,
    RenderComponent,
    RainyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PlotlyViaWindowModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CloudComponent, RainyComponent, PlotComponent]
})
export class AppModule { }
