import { Component, OnInit, Input } from '@angular/core';
import { Bus } from '../interfaces';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { StarredBusesService } from '../starred-buses.service';
import { isBusValidated } from '../utils';
import { DateTime, Zone } from 'luxon';

@Component({
  selector: 'ybb-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {

  constructor(
    public starManager: StarredBusesService
  ) { }

  @Input() public timezone?: string | Zone;
  @Input() public bus: Bus;

  public starIcon = faStar;

  get location() {
    if (isBusValidated(this.bus)) {
      if (this.bus.locations && this.bus.locations.length > 0) {
        return this.bus.locations[0];
      }
    }
  }

  get status() {
    if (this.bus.available) {
      if (this.bus.departure === undefined) {
        return this.location ? "Arrived at BCA" : "Not at BCA";
      } else {
        const departureMs = DateTime.local().setZone(this.timezone || "America/New_York").startOf("day").set({
          hour: Math.floor(this.bus.departure / 60),
          minute: this.bus.departure % 60
        }).toMillis();
        const departure = DateTime.fromMillis(departureMs);
        const departureStr = departure.toLocaleString({
          hour: "numeric", minute: "numeric"
        });
        const prefix = DateTime.local() <= departure ? "Departs at" : "Departed at";
        return `${prefix} ${departureStr}`;
      }
    } else {
      return "Not running";
    }
  }

  ngOnInit() {
  }

  public toggleStar() {
    this.starManager.setIsStarred(this.bus._id, !this.starManager.isStarred(this.bus._id));
  }

}
