import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
import { ApiService } from './api.service';

@Injectable( {
  providedIn: 'root',
} )
export class TimeService {

  constructor( private apiService: ApiService ) {
    this.sync();
  }

  private timeZone: string;
  private isoTime: number;
  private timer

  ready(): boolean {
    return this.isoTime !== undefined;
  }

  now(): number {
    return this.isoTime;
  }

  toLocal( utc ) {
    let local = moment( utc ).tz( this.timeZone );
    if ( local !== undefined ) {
      return {
        weekday: local.day(),
        date: local.date(),
        month: local.month(),
        year: local.year(),
        hours: local.hour(),
        minutes: local.minute(),
        seconds: local.second(),
        milliseconds: local.millisecond()
      };
    } else {
      return {};
    }
  }

  sync() {
    let t0: number = Date.now();
    this.apiService.getTime().subscribe(
      res => {
        this.timeZone = res.timeZone;
        let t1 = new Date( res.ebayTime ).getTime(),
          t2 = new Date( res.ebayTime ).getTime(),
          t3 = Date.now();

        let results = this.ntp( t0, t1, t2, t3 );

        clearInterval( this.timer );
        this.isoTime = t3 + results.offset;
        this.timer = setInterval( () => {
          this.isoTime += 100;
        }, 100 );
      },
      err => {
        console.error( 'Failed to get server time' );
      }
    );
  }

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


}