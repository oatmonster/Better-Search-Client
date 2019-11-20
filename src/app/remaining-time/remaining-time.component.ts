import { Component, Input, OnInit } from '@angular/core';

@Component( {
  selector: 'remaining-time',
  templateUrl: './remaining-time.component.html'
} )
export class RemainingTimeComponent implements OnInit {

  @Input()
  endTimeIso: string = '1970-01-01T00:00:00.000Z';

  endTime: number;

  status: string = 'normal';

  remainingTime: string;

  updateTimer;

  update() {
    let distance = this.endTime - Date.now();

    let days = Math.floor( distance / ( 1000 * 60 * 60 * 24 ) );
    let hours = Math.floor( ( distance % ( 1000 * 60 * 60 * 24 ) ) / ( 1000 * 60 * 60 ) );
    let minutes = Math.floor( ( distance % ( 1000 * 60 * 60 ) ) / ( 1000 * 60 ) );
    let seconds = Math.floor( ( distance % ( 1000 * 60 ) ) / 1000 );

    let remainingTime = '';

    if ( days > 0 ) {
      remainingTime += days + ( days === 1 ? ' day ' : ' days ' );
      if ( hours > 0 ) {
        remainingTime += hours + ( hours === 1 ? ' hour ' : ' hours ' );
      }
      remainingTime += 'left';
    } else if ( hours > 0 ) {
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


    this.remainingTime = remainingTime;
  }

  ngOnInit() {

    this.endTime = Date.parse( this.endTimeIso );

    this.update();

    this.updateTimer = setInterval( () => {
      this.update();
    }, 1000 );


  }

}