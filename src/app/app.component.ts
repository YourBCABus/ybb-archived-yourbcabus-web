import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'ybb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private api: ApiService
  ) {
    this.api.refreshSchool();
  }

  title = 'yourbcabus-web';
}
