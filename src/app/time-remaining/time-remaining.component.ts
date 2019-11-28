import { Component, Input, OnInit } from '@angular/core';

@Component( {
  selector: 'time-remaining',
  templateUrl: './time-remaining.component.html'
} )
export class TimeRemainingComponent implements OnInit {

  @Input()
  listingInfo: {
    startTimeUtc: string,
    endTimeUtc: string,
    endTimeLocal: string,
    timeRemaining: string,
    timeTilEndDay: string
  }

  private updateTimer;

  private timeRemaining: number;

  private timeTilEndDay: number;

  private endDate;

  timeRemainingDisplay: string;

  endTimeDisplay: string;

  status: string = 'normal';

  private parseDate( date: string ) {
    let regex = /(?:(\w+)\s)(?:(\w+)\s)(?:(\w+)\s)(?:(\w+)\s)(?:([\d]+):)(?:([\d]+):)?(?:([\d]+))/
    let matches = date.match( regex );
    return {
      weekday: matches[ 1 ],
      month: matches[ 2 ],
      day: +matches[ 3 ],
      year: +matches[ 4 ],
      hours: +matches[ 5 ],
      minutes: +matches[ 6 ],
      seconds: +matches[ 7 ]
    }
  }

  private parseDuration( durationIso: string ) {
    let regex = /P(?:([.,\d]+)D)?(?:T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?)?/
    let matches = durationIso.match( regex );

    let days = matches[ 1 ] === undefined ? 0 : +matches[ 1 ];
    let hours = matches[ 2 ] === undefined ? 0 : +matches[ 2 ];
    let minutes = matches[ 3 ] === undefined ? 0 : +matches[ 3 ];
    let seconds = matches[ 4 ] === undefined ? 0 : +matches[ 4 ];

    return seconds + minutes * 60 + hours * 60 * 60 + days * 60 * 60 * 24;
  }

  private update() {
    this.timeRemaining -= 1;
    this.timeTilEndDay -= 1;

    let days = Math.floor( this.timeRemaining / ( 60 * 60 * 24 ) );
    let hours = Math.floor( ( this.timeRemaining % ( 60 * 60 * 24 ) ) / ( 60 * 60 ) );
    let minutes = Math.floor( ( this.timeRemaining % ( 60 * 60 ) ) / ( 60 ) );
    let seconds = Math.floor( ( this.timeRemaining % ( 60 ) ) );

    let timeRemainingDisplay = '';

    if ( days > 0 ) {
      this.status = 'normal';
      timeRemainingDisplay += days + ( days === 1 ? ' day ' : ' days ' );
      if ( hours > 0 ) {
        timeRemainingDisplay += hours + ( hours === 1 ? ' hour ' : ' hours ' );
      }
      timeRemainingDisplay += 'left';
    } else if ( hours > 0 ) {
      this.status = 'normal';
      timeRemainingDisplay += hours + ( hours === 1 ? ' hour ' : ' hours ' );
      if ( minutes > 0 ) {
        timeRemainingDisplay += minutes + ( minutes === 1 ? ' minute ' : ' minutes ' );
      }
      timeRemainingDisplay += 'left';
    } else if ( minutes > 0 ) {
      this.status = 'urgent';
      timeRemainingDisplay += minutes + ( minutes === 1 ? ' minute ' : ' minutes left' );
    } else if ( seconds > 0 ) {
      this.status = 'urgent';
      timeRemainingDisplay += seconds + ( seconds === 1 ? ' second ' : ' seconds left' );
    } else {
      this.status = 'ended';
      timeRemainingDisplay = 'Ended'
    }

    let endTimeDisplay = '(';

    if ( this.timeTilEndDay <= 0 ) {
      endTimeDisplay += 'Today'
    } else {
      endTimeDisplay += this.endDate.weekday;
    }

    let hour = this.endDate.hours;
    let minute = String( this.endDate.minutes ).padStart( 2, '0' );
    if ( hour === 0 ) {
      endTimeDisplay += ' 12:' + minute + ' AM)';
    } else if ( hour <= 11 ) {
      endTimeDisplay += ' ' + hour + ':' + minute + ' AM)';
    } else if ( hour === 12 ) {
      endTimeDisplay += ' 12:' + minute + ' PM)';
    } else {
      endTimeDisplay += ' ' + ( hour - 12 ) + ':' + minute + ' PM)';
    }

    this.timeRemainingDisplay = timeRemainingDisplay;
    this.endTimeDisplay = endTimeDisplay;

  }

  private reset() {
    clearInterval( this.updateTimer );
    this.timeRemaining = this.parseDuration( this.listingInfo.timeRemaining );
    this.timeTilEndDay = this.parseDuration( this.listingInfo.timeTilEndDay );
    this.endDate = this.parseDate( this.listingInfo.endTimeLocal );

    this.update();

    this.updateTimer = setInterval( () => {
      this.update();
    }, 1000 );
  }

  ngOnInit() {
    this.reset();
  }

}