import { Component, OnInit, Input } from '@angular/core';
import { Bus } from '../interfaces';

@Component({
  selector: 'ybb-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {

  constructor() { }

  @Input() public bus: Bus;

  get location() {
    if (this.bus.locations && this.bus.locations.length > 0) {
      return this.bus.locations[0];
    }
  }

  get status() {
    if (this.bus.available) {
      return this.location ? "Arrived at BCA" : "Not at BCA";
    } else {
      return "Not running";
    }
  }

  ngOnInit() {
  }

}
