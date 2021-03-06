import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor( private loadingService: LoadingService ) { }

  private reqSent: number = 0;
  private reqCompleted: number = 0;
  private reqTotal: number = 0;
  private startTimeout;

  setComplete() {
    clearTimeout( this.startTimeout );
    this.reqCompleted = 0;
    this.reqSent = 0;
    this.reqTotal = 0;
    this.loadingService.complete();
  }

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    if ( this.reqSent === 0 ) {
      this.startTimeout = setTimeout( () => {
        this.loadingService.start();
      }, 200 );
    }

    this.reqSent++;
    this.reqTotal++
    this.loadingService.setWidth( this.reqCompleted / this.reqTotal * 100 );

    return next.handle( req ).pipe( finalize( () => {
      this.reqCompleted++;
      this.loadingService.setWidth( this.reqCompleted / this.reqTotal * 100 );

      if ( this.reqCompleted >= this.reqTotal ) {
        this.setComplete();
      }
    } ) );
  }
}