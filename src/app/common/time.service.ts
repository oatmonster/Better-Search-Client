import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable( {
  providedIn: 'root',
} )
export class TimeService {

  constructor( private apiService: ApiService ) {
    console.log( 'created' );
  }

  isoTime: number;
  timer

  // The NTP algorithm
  // t0 is the client's timestamp of the request packet transmission,
  // t1 is the server's timestamp of the request packet reception,
  // t2 is the server's timestamp of the response packet transmission and
  // t3 is the client's timestamp of the response packet reception.
  ntp( t0: number, t1: number, t2: number, t3: number ) {
    return {
      roundTripDelay: ( t3 - t0 ) - ( t2 - t1 ),
      offset: ( ( t1 - t0 ) + ( t2 - t3 ) ) / 2
    };
  }

  sync() {
    let t0: number = Date.now();
    this.apiService.getTime().subscribe( res => {
      let t1 = new Date( res.ebayTime ).getTime(),
        t2 = new Date( res.ebayTime ).getTime(),
        t3 = new Date();

      let results = this.ntp( t0, t1, t2, t3.getTime() );
      console.log( 'NTP delay:', results.roundTripDelay, 'NTP offset:', results.offset, 'Corrected: ', ( new Date( t3.getTime() + results.offset ) ) );
      console.log( 'Ebay Time:' );
      console.log( res.ebayTime );
      console.log( 'Client Time:' );
      console.log( t3.toISOString() );
      console.log( 'Corrected Time' );
      console.log( new Date( t3.getTime() + results.offset ).toISOString() );
    } );
  }
}