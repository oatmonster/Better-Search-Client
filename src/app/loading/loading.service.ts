import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  private width: number;
  private visible: boolean = false;
  private incTimeout;

  start() {
    this.width = 0;
    this.visible = true;
  }

  complete() {
    this.width = 100;
    setTimeout( () => this.visible = false, 250 );
  }

  setWidth( width: number ) {
    this.width = width;
    clearTimeout( this.incTimeout );
    this.incTimeout = setTimeout( () => this.increment(), 250 );
  }

  private increment() {
    if ( this.width >= 99 ) return;
    let inc: number = Math.max( 100 / ( this.width + 10 ) - Math.random(), 0 );
    this.setWidth( this.width + inc );
  }

  getVisible() {
    return this.visible;
  }

  getWidth() {
    return this.width;
  }
}