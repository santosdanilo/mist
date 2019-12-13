import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rainy',
  templateUrl: './rainy.component.html',
  styleUrls: ['./rainy.component.scss']
})
export class RainyComponent implements OnInit {
  @Input() text:string = ''
  constructor() { }

  ngOnInit() {
  }

}
