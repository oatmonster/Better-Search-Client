import { Component, Input, OnInit } from '@angular/core';

@Component( {
  selector: 'remaining-time',
  templateUrl: './remaining-time.component.html'
} )
export class RemainingTimeComponent implements OnInit {

  @Input()
  endTimeIso: string;

  endTime: Date;

  status: string = 'normal';

  remainingTime: string;

  endTimeDisplay: string;

  updateTimer;

  private update() {
    let distance = this.endTime.getTime() - Date.now();

    let days = Math.floor( distance / ( 1000 * 60 * 60 * 24 ) );
    let hours = Math.floor( ( distance % ( 1000 * 60 * 60 * 24 ) ) / ( 1000 * 60 * 60 ) );
    let minutes = Math.floor( ( distance % ( 1000 * 60 * 60 ) ) / ( 1000 * 60 ) );
    let seconds = Math.floor( ( distance % ( 1000 * 60 ) ) / 1000 );

    let remainingTime = '';

    if ( days > 0 ) {
      this.status = 'normal';
      remainingTime += days + ( days === 1 ? ' day ' : ' days ' );
      if ( hours > 0 ) {
        remainingTime += hours + ( hours === 1 ? ' hour ' : ' hours ' );
      }
      remainingTime += 'left';
    } else if ( hours > 0 ) {
      this.status = 'normal';
      remainingTime += hours + ( hours === 1 ? ' hour ' : ' hours ' );
      if ( minutes > 0 ) {
        remainingTime += minutes + ( minutes === 1 ? ' minute ' : ' minutes ' );
      }
      remainingTime += 'left';
    } else if ( minutes > 0 ) {
      this.status = 'urgent';
      remainingTime += minutes + ( minutes === 1 ? ' minute ' : ' minutes left' );
    } else if ( seconds > 0 ) {
      this.status = 'urgent';
      remainingTime += seconds + ( seconds === 1 ? ' second ' : ' seconds left' );
    } else {
      this.status = 'ended';
      remainingTime = 'Ended'
    }

    let endTimeDisplay = '(';

    if ( this.endTime.toDateString() === new Date().toDateString() ) {
      endTimeDisplay += 'Today'
    } else {
      endTimeDisplay += new Intl.DateTimeFormat( 'en-US', { weekday: 'short' } ).format( this.endTime );
    }

    let hour = this.endTime.getHours();
    if ( hour === 0 ) {
      endTimeDisplay += ' 12:' + this.endTime.getMinutes() + ' AM)';
    } else if ( hour <= 11 ) {
      endTimeDisplay += ' ' + hour + ':' + this.endTime.getMinutes() + ' AM)';
    } else if ( hour === 12 ) {
      endTimeDisplay += ' 12:' + this.endTime.getMinutes() + ' PM)';
    } else {
      endTimeDisplay += ' ' + ( hour - 12 ) + ':' + this.endTime.getMinutes() + ' PM)';
    }

    this.remainingTime = remainingTime;
    this.endTimeDisplay = endTimeDisplay;

  }

  private reset() {
    clearInterval( this.updateTimer );
    this.endTime = new Date( this.endTimeIso );

    this.update();

    this.updateTimer = setInterval( () => {
      this.update();
    }, 1000 );
  }

  ngOnInit() {
    this.reset();
  }

}