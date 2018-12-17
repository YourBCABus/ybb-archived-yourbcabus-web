import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { StarredBusesService } from '../starred-buses.service';
import { FormControl } from '@angular/forms';
import { Bus } from '../interfaces';
import { debounceTime } from 'rxjs/operators';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ybb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  public searchIcon = faSearch;
  public searchField = new FormControl("");
  public buses: Bus[] = [];
  public starredBuses: Bus[] = [];
  public debounceTime = 100;

  busFilter(searchTerm: string) {
    let processed = searchTerm.trim().toLowerCase();
    return (bus: Bus) => {
      return (bus.name && bus.name.toLowerCase().includes(processed)) || (bus.locations && bus.locations.findIndex(location => location.toLowerCase() === processed) >= 0);
    };
  }

  refreshBuses() {
    let searchTerm = this.searchField.value as string;
    if (searchTerm && searchTerm.trim().length > 0) {
      let filter = this.busFilter(searchTerm);
      this.buses = this.api.buses.value.filter(filter);
      this.starredBuses = this.starManager.starredBuses.value.filter(filter);
    } else {
      this.buses = this.api.buses.value;
      this.starredBuses = this.starManager.starredBuses.value;
    }
  }

  constructor(
    public api: ApiService,
    public starManager: StarredBusesService
  ) {}

  ngOnInit() {
    this.api.buses.subscribe(() => {
      this.refreshBuses();
    });

    this.starManager.starredBuses.subscribe(() => {
      this.refreshBuses();
    });

    this.searchField.valueChanges.pipe(debounceTime(this.debounceTime)).subscribe(() => {
      this.refreshBuses();
    });
  }

  trackBus(bus: Bus) {
    return bus._id;
  }

}
