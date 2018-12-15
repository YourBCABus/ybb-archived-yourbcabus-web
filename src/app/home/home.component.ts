import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'ybb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

  constructor(
    public api: ApiService
  ) {}

  ngOnInit() {
  }

}
