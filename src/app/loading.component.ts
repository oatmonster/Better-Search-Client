import { Component } from "@angular/core";
import { LoadingService } from "./loading.service";
import { trigger, transition, style, animate } from '@angular/animations'

@Component( {
  selector: 'loading',
  template: `
    <div class="progress loading" *ngIf="loadingService.getVisible()" [@fadeOut]>
      <div class="progress-bar" role="progressbar" [style.width.%]="loadingService.getWidth()"></div>
    </div>
  `,
  styles: [ `
    .loading {
      position: fixed;
      width: 100%;
      z-index: 10000;
    }
  ` ],
  animations: [
    trigger(
      'fadeOut',
      [
        transition(
          ':leave',
          [
            style( { opacity: 1 } ),
            animate( '500ms ease-in', style( { opacity: 0 } ) )
          ]
        )
      ]
    )
  ]
} )
export class LoadingComponent {
  constructor( private loadingService: LoadingService ) { }
}