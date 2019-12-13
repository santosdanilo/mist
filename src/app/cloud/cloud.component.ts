import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.scss']
})
export class CloudComponent implements OnInit {
  @Input() text:string = ''
  constructor() { }

  ngOnInit() {
  }

}
