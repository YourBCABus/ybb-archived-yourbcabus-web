import { Component, OnInit, Input } from '@angular/core';
import { Bus } from '../interfaces';
import { isBusValidated } from '../utils';

@Component({
  selector: 'ybb-bus-location',
  templateUrl: './bus-location.component.html',
  styleUrls: ['./bus-location.component.scss']
})
export class BusLocationComponent implements OnInit {

  constructor() { }

  @Input() public bus: Bus;

  get location() {
    if (isBusValidated(this.bus)) {
      if (this.bus.locations && this.bus.locations.length > 0) {
        return this.bus.locations[0];
      }
    }
  }

  ngOnInit() {
  }

}
