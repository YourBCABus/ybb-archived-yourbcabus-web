import { Injectable, EventEmitter, isDevMode } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { School, Bus } from './interfaces';

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

  public school = new BehaviorSubject<School>(null);

  private refreshObservable: Observable<number> = interval(15000);
  public isAutoRefreshingOn = true;

  public url = "https://db.yourbcabus.com";
  public schoolId = "5bca51e785aa2627e14db459";

  public refreshSchool() {
    this.http.get<School>(`${this.url}/schools/${this.schoolId}`).subscribe((school) => {
      this.school.next(school);
    });
  }

  public refreshBuses() {
    this.http.get<Bus[]>(`${this.url}/schools/${this.schoolId}/buses`).subscribe((buses) => {
      buses.forEach((bus) => {
        bus.invalidate_time = bus.invalidate_time && new Date(bus.invalidate_time);
      });
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
