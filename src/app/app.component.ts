import { Component, OnInit, Type } from '@angular/core';
import { CloudComponent } from './cloud/cloud.component';
import { RainyComponent } from './rainy/rainy.component';
import { MetaInfo } from './dynamic/metainfo.model';
import { PlotComponent } from 'angular-plotly.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mist';
  metaInfo: MetaInfo[] = [
    {
      component: CloudComponent,
      template: `<aside><ng-template appInsertionDyn></ng-template></aside>`,
      inputs: {
        value: {
          text: 'poison'
        }
      }
    },
    {
      component: RainyComponent,
      template: `<aside><ng-template appInsertionDyn></ng-template></aside>`,
      inputs: {
        value: {
          text: 'fire'
        }
      }
    }
  ]
  ngOnInit(): void {

  }

  changeOrder() {
    this.metaInfo = [
      {
        component: RainyComponent, inputs: {
          value: {
            text: 'fire'
          }
        }
      },
      {
        component: PlotComponent,
        inputs: {
          force: true,
          value: {
            data: [
              { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: { color: 'red' } },
              { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
            ],
            layout: { title: 'A Fancy Plot' }
          }
        },
        outputs: {
          value: {
            hover: {
              success: () => console.log('Hello')
            }
          }
        }
      },
      {
        component: CloudComponent, inputs: {
          value: {
            text: 'poison'
          }
        }
      }
    ]
  }
}
