import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Bus } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient
  ) {
    this.refreshObservable.subscribe((_) => {
      if (this.isAutoRefreshingOn) {
        this.refreshBuses();
      }
    });

    if (this.isAutoRefreshingOn) {
      this.refreshBuses();
    }
  }

  public buses = new BehaviorSubject<Bus[]>([]);
  public onRefreshBuses = new EventEmitter<Bus[]>();

  private refreshObservable: Observable<number> = interval(15000);
  public isAutoRefreshingOn = true;

  public url = "https://db.yourbcabus.com/schools/5bca51e785aa2627e14db459";

  public refreshBuses() {
    this.http.get<Bus[]>(`${this.url}/buses`).subscribe((buses) => {
      buses.sort((a, b) => {
        if (a.available && !b.available) {
          return -1;
        } else if (!a.available && b.available) {
          return 1;
        } else {
          if (a.name && !b.name) {
            return -1;
          } else if (!a.name && b.name) {
            return 1;
          } else {
            if (a.name > b.name) {
              return 1;
            } else if (a.name < b.name) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      });
      this.buses.next(buses);
      this.onRefreshBuses.emit(buses);
    });
  }
}