import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { StarredBusesService } from '../starred-buses.service';
import { FormControl } from '@angular/forms';
import { Bus } from '../interfaces';
import { debounceTime } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faList, faColumns, faMap } from '@fortawesome/free-solid-svg-icons';

export enum HomeDisplayMode {
  List,
  Split,
  Map
}

interface HomeDisplayModeItem {
  displayMode: HomeDisplayMode;
  icon?: IconDefinition;
  name?: string;
  fallback?: HomeDisplayMode;
  threshold?: string;
  surpressed?: boolean;
}

@Component({
  selector: 'ybb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public static displayModes: HomeDisplayModeItem[] = [
    {displayMode: HomeDisplayMode.List, icon: faList, name: "List"},
    {displayMode: HomeDisplayMode.Split, icon: faColumns, name: "Split", fallback: HomeDisplayMode.List, threshold: "(min-width: 768px)"},
    {displayMode: HomeDisplayMode.Map, icon: faMap, name: "Map"}
  ];

  public isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  public searchIcon = faSearch;
  public searchField = new FormControl("");
  public buses: Bus[] = [];
  public starredBuses: Bus[] = [];
  public debounceTime = 100;
  public displayModes = HomeComponent.displayModes;
  public activeDisplayMode = HomeDisplayMode.List;
  public loadMap = false;
  public mapSearch: Record<string, boolean> = null;

  busFilter(searchTerm: string) {
    let processed = searchTerm.trim().toLowerCase().replace(/ /g, "");
    return (bus: Bus) => {
      return (bus.name && bus.name.replace(/ /g, "").toLowerCase().includes(processed)) || (bus.locations && bus.locations.findIndex(location => location.toLowerCase() === processed) >= 0);
    };
  }

  refreshBuses() {
    let searchTerm = this.searchField.value as string;
    if (searchTerm && searchTerm.trim().length > 0) {
      let filter = this.busFilter(searchTerm);
      this.buses = this.api.buses.value.filter(filter);
      this.starredBuses = this.starManager.starredBuses.value.filter(filter);
      this.mapSearch = {};
      this.buses.forEach(bus => {
        this.mapSearch[bus._id] = true;
      });
    } else {
      this.buses = this.api.buses.value;
      this.starredBuses = this.starManager.starredBuses.value;
      this.mapSearch = null;
    }
  }

  constructor(
    public api: ApiService,
    public starManager: StarredBusesService,
    public breakpointObserver: BreakpointObserver
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

    this.displayModes.forEach(item => {
      if (item.threshold) {
        this.breakpointObserver.observe(item.threshold).subscribe(result => {
          item.surpressed = !result.matches;
        });
      }
    });
  }

  trackBus(bus: Bus) {
    return bus._id;
  }

  setDisplayMode(mode: HomeDisplayMode, event: Event = null) {
    if (event) {
      event.preventDefault();
    }

    this.activeDisplayMode = mode;

    if (this.activeDisplayMode === HomeDisplayMode.Split || this.activeDisplayMode === HomeDisplayMode.Map) {
      this.loadMap = true;
    }
  }

  get effectiveDisplayMode() {
    const item = this.displayModes.find(item => item.displayMode === this.activeDisplayMode);
    if (item && item.surpressed) {
      return (item.fallback || item.fallback === 0) ? item.fallback : this.activeDisplayMode;
    }

    return this.activeDisplayMode;
  }

}
