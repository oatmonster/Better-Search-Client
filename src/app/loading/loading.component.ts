import { Component } from '@angular/core';

import { LoadingService } from './loading.service';
import { fadeOut } from '../common/animations';

@Component( {
  selector: 'loading',
  template: `
    <div class="progress loading rounded-0" *ngIf="visible()" [@fadeOut]>
      <div class="progress-bar bg-warning" role="progressbar" [style.width.%]="width()"></div>
    </div>
  `,
  styles: [ `
    .loading {
      position: fixed;
      width: 100%;
      height: 8px;
      z-index: 10000;
    }
  ` ],
  animations: [ fadeOut ]
} )
export class LoadingComponent {
  constructor( private loadingService: LoadingService ) { }

  visible() {
    return this.loadingService.getVisible();
  }

  width() {
    return this.loadingService.getWidth();
  }

}