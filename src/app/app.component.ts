import { Component, OnInit, Type } from '@angular/core';
import { CloudComponent } from './cloud/cloud.component';
import { RainyComponent } from './rainy/rainy.component';
import { MetaInfo } from './dynamic/metainfo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mist';
  metaInfo: MetaInfo[] = [
    { component: CloudComponent, inputs: { text: 'poison' } },
    { component: RainyComponent, inputs: { text: 'fire' } }
  ]
  ngOnInit(): void {

  }

  changeOrder() {
    this.metaInfo = [
      { component: RainyComponent, inputs: { text: 'fire' } },
      { component: CloudComponent, inputs: { text: 'poison' } }
    ]
  }
}
