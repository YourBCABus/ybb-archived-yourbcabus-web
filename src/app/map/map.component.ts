import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { StarredBusesService } from '../starred-buses.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bus, Coordinate } from '../interfaces';
import { isBusValidated } from '../utils';

// Too lazy to port aCoords and bCoords from iOS.
export function CLLocationCoordinate2D(latitude: number, longitude: number): Coordinate {
  return {latitude, longitude};
}

export interface BusMarker {
  bus_id: string;
  name?: string;
  coordinate: Coordinate;
  location: string;
}

export interface ZCoordinate extends Coordinate {
  z: number;
}

@Component({
  selector: 'ybb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    public api: ApiService,
    private starred: StarredBusesService
  ) { }

  @Input() searching: Record<string, boolean>;

  public latitudeDelta = -0.0003;
  public longitudeDelta = 0.0004;

  public buses: Observable<BusMarker[]> = new Observable<BusMarker[]>();

  public aCoords = [
    CLLocationCoordinate2D(40.9002284, -74.0339698),
    CLLocationCoordinate2D(40.9002946, -74.033927),
    CLLocationCoordinate2D(40.9003482, -74.033895),
    CLLocationCoordinate2D(40.900407, -74.0338587),
    CLLocationCoordinate2D(40.9004668, -74.0338225),
    CLLocationCoordinate2D(40.9005171, -74.0337916),
    CLLocationCoordinate2D(40.9005664, -74.0337546)
  ];
  public aDLat = -0.000015;
  public aDLong = 0.00003;
  public aCharset = ["A", "B", "C", "D", "E"];

  public bCoords = [
    CLLocationCoordinate2D(40.9006914, -74.0336413),
    CLLocationCoordinate2D(40.9006722, -74.033542),
    CLLocationCoordinate2D(40.900659, -74.0334482),
    CLLocationCoordinate2D(40.9006388, -74.0333529),
    CLLocationCoordinate2D(40.9006093, -74.0332416),
    CLLocationCoordinate2D(40.9005677, -74.0331397),
    CLLocationCoordinate2D(40.900516, -74.0330405),
    CLLocationCoordinate2D(40.9004643, -74.0329425),
    CLLocationCoordinate2D(40.9004044, -74.0328514),
    CLLocationCoordinate2D(40.90034, -74.0327756)
  ];
  public bDLat = -0.00004;
  public bDLong = 0;
  public bCharset = ["F", "G", "H", "I", "J", "K"];

  public auCoord = {latitude: 40.9017077, longitude: -74.0346963, z: 5000};
  public auString = "AU";

  coordinateForBus(bus: Bus): ZCoordinate {
    if (bus.locations && bus.locations.length > 0) {
      const location = bus.locations[0].toUpperCase().trim();

      if (location === this.auString) {
        return this.auCoord;
      }

      const letter   = location[0];
      const numeral  = parseInt(location.slice(1));

      if (!Number.isNaN(numeral)) {
        const aIndex = this.aCharset.indexOf(letter);
        if (aIndex >= 0) {
          const coord = this.aCoords[numeral];
          const multiplier = aIndex - 1;
          return {
            latitude: coord.latitude + this.aDLat * multiplier,
            longitude: coord.longitude + this.aDLong * multiplier,
            z: multiplier * this.aCharset.length + numeral
          };
        }

        const bIndex = this.bCharset.indexOf(letter);
        if (bIndex >= 0) {
          const coord = this.bCoords[numeral];
          const multiplier = bIndex - 1;
          return {
            latitude: coord.latitude + this.bDLat * multiplier,
            longitude: coord.longitude + this.bDLong * multiplier,
            z: multiplier * this.bCharset.length + this.aCoords.length * this.aCharset.length + numeral
          };
        }
      }
    }
  }

  opacityForBus(marker: BusMarker) {
    return (this.searching && !this.searching[marker.bus_id]) ? 0.2 : 1;
  }

  iconUrlForMarker(marker: BusMarker) {
    return `https://yourbcabus.com/assets/markers/${this.starred.isStarred(marker.bus_id) ? "starred" : "standard"}.png`;
  }

  ngOnInit() {
    this.buses = this.api.buses.pipe(map(buses => buses.filter(bus => {
      return ((isBusValidated(bus) && bus.locations) && bus.locations.length > 0) && this.coordinateForBus(bus);
    }).map(bus => {
      return {
        bus_id: bus._id,
        name: bus.name,
        coordinate: this.coordinateForBus(bus),
        location: bus.locations[0]
      };
    })));
  }

  trackBus(bus: Bus) {
    return bus._id;
  }

}
