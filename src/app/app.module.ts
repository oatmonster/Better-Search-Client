import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ApiService } from './common/api.service';
import { LoadingService } from './loading/loading.service';
import { IsoCountryService } from './common/iso-country.service';
import { TimeService } from './common/time.service';
import { SearchService } from './common/search.service';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { ItemThumbnailComponent } from './item-thumbnail/item-thumbnail.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoadingComponent } from './loading/loading.component';
import { HomeComponent } from './home/home.component';
import { DropdownInputComponent } from './form-controls/dropdown-input/dropdown-input.component';
import { PageInputComponent } from './form-controls/page-input/page-input.component';
import { CategoryInputComponent } from './form-controls/category-input/category-input.component';
import { SquareCarouselComponent } from './common/square-carousel/square-carousel.component';
import { TimeRemainingComponent } from './time-remaining/time-remaining.component';

import { LoadingInterceptor } from './loading/loading.interceptor';

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
    DropdownInputComponent,
    PageInputComponent,
    CategoryInputComponent,
    SquareCarouselComponent,
    TimeRemainingComponent,
  ],
  providers: [
    ApiService,
    LoadingService,
    IsoCountryService,
    TimeService,
    SearchService,
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