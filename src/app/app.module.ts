import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ApiService } from './api.service';
import { LoadingService } from './loading.service';

import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { ItemThumbnailComponent } from './item-thumbnail.component';
import { ItemDetailComponent } from './item-detail.component';
import { NotFoundComponent } from './not-found.component';
import { LoadingComponent } from './loading.component';
import { HomeComponent } from './home/home.component';


import { LoadingInterceptor } from './loading.interceptor';

import { appRoutes } from './routes';

@NgModule( {
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot( appRoutes ),
  ],
  declarations: [
    AppComponent,
    SearchComponent,
    ItemThumbnailComponent,
    ItemDetailComponent,
    NotFoundComponent,
    LoadingComponent,
    HomeComponent,
  ],
  providers: [
    ApiService,
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
  ],
  bootstrap: [
    AppComponent,
  ]
} )
export class AppModule { }