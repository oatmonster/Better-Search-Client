import { Component, Input, OnInit } from '@angular/core';
import { TimeService } from '../common/time.service';

@Component( {
  selector: 'time-remaining',
  templateUrl: './time-remaining.component.html'
} )
export class TimeRemainingComponent implements OnInit {

  constructor( private timeService: TimeService ) { }

  @Input()
  endTimeUtc: string;

  private updateTimer;
  private timeRemaining: number;
  private endTime;
  private endTimeIso: number;

  private weekdays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat' ];

  timeRemainingDisplay: string;

  endTimeDisplay: string;

  status: string = 'normal';

  private update() {
    if ( this.timeService.ready() ) {
      let nowIso = this.timeService.now();
      this.timeRemaining = this.endTimeIso - nowIso;

      let days = Math.floor( this.timeRemaining / ( 1000 * 60 * 60 * 24 ) );
      let hours = Math.floor( ( this.timeRemaining % ( 1000 * 60 * 60 * 24 ) ) / ( 1000 * 60 * 60 ) );
      let minutes = Math.floor( ( this.timeRemaining % ( 1000 * 60 * 60 ) ) / ( 1000 * 60 ) );
      let seconds = Math.floor( ( this.timeRemaining % ( 1000 * 60 ) / 1000 ) );

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

      if ( this.endTime === undefined ) {
        this.endTime = this.timeService.toLocal( this.endTimeIso );
      }

      let now = this.timeService.toLocal( nowIso );
      let endTimeDisplay = '(';

      if ( now.date === this.endTime.date
        && now.month === this.endTime.month
        && now.year === this.endTime.year
      ) {
        endTimeDisplay += 'Today'
      } else {
        endTimeDisplay += this.weekdays[ this.endTime.weekday ];
      }

      let hour = this.endTime.hours;
      let minute = String( this.endTime.minutes ).padStart( 2, '0' );
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
  }

  private reset() {
    clearInterval( this.updateTimer );
    this.endTimeIso = new Date( this.endTimeUtc ).getTime()

    this.update();

    this.updateTimer = setInterval( () => {
      this.update();
    }, 1000 );
  }

  ngOnInit() {
    this.reset();
  }

}