import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'ybb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    public api: ApiService
  ) { }

  public latitudeDelta = -0.0003;
  public longitudeDelta = 0.0004;

  ngOnInit() {
  }

}
