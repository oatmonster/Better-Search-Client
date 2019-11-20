import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor( private loadingService: LoadingService ) { }

  private reqSent_: number = 0;
  private reqCompleted_: number = 0;
  private reqTotal_: number = 0;
  private startTimeout_;

  setComplete() {
    clearTimeout( this.startTimeout_ );
    this.reqCompleted_ = 0;
    this.reqSent_ = 0;
    this.reqTotal_ = 0;
    this.loadingService.complete();
  }

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    if ( this.reqSent_ === 0 ) {
      this.startTimeout_ = setTimeout( () => {
        this.loadingService.start();
      }, 200 );
    }

    this.reqSent_++;
    this.reqTotal_++
    this.loadingService.setWidth( this.reqCompleted_ / this.reqTotal_ * 100 );

    return next.handle( req ).pipe( finalize( () => {
      this.reqCompleted_++;
      this.loadingService.setWidth( this.reqCompleted_ / this.reqTotal_ * 100 );

      if ( this.reqCompleted_ >= this.reqTotal_ ) {
        this.setComplete();
      }
    } ) );
  }
}