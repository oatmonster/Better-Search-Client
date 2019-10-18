import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from './api.service';
import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { ItemThumbnailComponent } from './item-thumbnail.component';

@NgModule( {
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    SearchComponent,
    ItemThumbnailComponent,
  ],
  providers: [
    ApiService,
  ],
  bootstrap: [
    AppComponent,
  ]
} )
export class AppModule { }

export interface IItem {
  pic?: string;
}