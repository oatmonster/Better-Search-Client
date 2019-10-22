import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ApiService } from './api.service';
import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { ItemThumbnailComponent } from './item-thumbnail.component';
import { ItemDetailComponent } from './item-detail.component';
import { NotFoundComponent } from './not-found.component';

import { appRoutes } from './routes';

@NgModule( {
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot( appRoutes, { onSameUrlNavigation: 'reload' } ),
  ],
  declarations: [
    AppComponent,
    SearchComponent,
    ItemThumbnailComponent,
    ItemDetailComponent,
    NotFoundComponent,
  ],
  providers: [
    ApiService,
  ],
  bootstrap: [
    AppComponent,
  ]
} )
export class AppModule { }