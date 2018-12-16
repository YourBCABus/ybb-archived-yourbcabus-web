import { Component, OnInit, Input } from '@angular/core';
import { Bus } from '../interfaces';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { StarredBusesService } from '../starred-buses.service';

@Component({
  selector: 'ybb-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {

  constructor(
    private starManager: StarredBusesService
  ) { }

  @Input() public bus: Bus;

  public starIcon = faStar;

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

  public toggleStar() {
    this.starManager.setIsStarred(this.bus._id, !this.starManager.isStarred(this.bus._id));
  }

}
