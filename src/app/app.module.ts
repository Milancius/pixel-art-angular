import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServerCommunication } from './communication.service';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    ServerCommunication
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
