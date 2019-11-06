import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  private width: number;
  private visible: boolean = false;

  start() {
    this.width = 0;
    this.visible = true;
  }

  complete() {
    this.width = 100;
    setTimeout( () => this.visible = false, 250 );
  }

  getVisible() {
    return this.visible;
  }

  setWidth( width: number ) {
    this.width = width;
  }

  getWidth() {
    return this.width;
  }
}