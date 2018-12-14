import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BusComponent } from './bus/bus.component';
import { BusLocationComponent } from './bus-location/bus-location.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BusComponent,
    BusLocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class YourBCABusModule { }
