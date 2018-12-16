import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bus } from './interfaces';
import { ApiService } from './api.service';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

type StorageService = LocalStorageService | SessionStorageService;

@Injectable({
  providedIn: 'root'
})
export class StarredBusesService {
  private starredIds: Record<string, boolean> = {};

  public starredBuses = new BehaviorSubject<Bus[]>([]);

  private populateStarredBuses(buses: Bus[]) {
    this.starredBuses.next(buses.filter(bus => this.starredIds[bus._id]));
  }

  private fetchStarredBuses(storageService: StorageService = this.storageService) {
    const keys: string[] = storageService.retrieve(this.starredBusesStorageKey);
    this.starredIds = {};
    if (keys) {
      keys.forEach(key => {
        this.starredIds[key] = true;
      });
    }
  }

  private saveStarredBuses(storageService: StorageService = this.storageService) {
    storageService.store(this.starredBusesStorageKey, Object.keys(this.starredIds).filter(id => this.starredIds[id]));
  }

  public storageService: StorageService;
  public starredBusesStorageKey = "YBBStarredBuses";

  constructor(
    private api: ApiService,
    localStorage: LocalStorageService
  ) {
    this.storageService = localStorage;
    this.fetchStarredBuses();

    this.api.buses.subscribe(buses => {
      this.populateStarredBuses(buses);
    });
  }

  public isStarred(id: string) {
    return !!this.starredIds[id];
  }

  public setIsStarred(id: string, starred: boolean) {
    this.fetchStarredBuses();
    this.starredIds[id] = starred;
    this.saveStarredBuses();
    this.populateStarredBuses(this.api.buses.getValue());
  }
}
