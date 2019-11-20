import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  private width_: number;
  private visible_: boolean = false;
  private incTimeout_;

  start() {
    this.width_ = 0;
    this.visible_ = true;
  }

  complete() {
    this.width_ = 100;
    setTimeout( () => this.visible_ = false, 250 );
  }

  setWidth( width: number ) {
    this.width_ = width;
    clearTimeout( this.incTimeout_ );
    this.incTimeout_ = setTimeout( () => this.increment_(), 250 );
  }

  private increment_() {
    if ( this.width_ >= 99 ) return;
    let inc: number = Math.max( 100 / ( this.width_ + 10 ) - Math.random(), 0 );
    this.setWidth( this.width_ + inc );
  }

  getVisible() {
    return this.visible_;
  }

  getWidth() {
    return this.width_;
  }
}