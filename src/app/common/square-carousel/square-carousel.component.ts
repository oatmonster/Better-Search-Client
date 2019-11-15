import { Component, OnInit, Input } from '@angular/core';

@Component( {
  selector: 'square-carousel',
  templateUrl: 'square-carousel.component.html',
  styleUrls: [ 'square-carousel.component.css' ]
} )
export class SquareCarouselComponent implements OnInit {

  @Input()
  items: string[] = [];

  @Input()
  thumbnails: boolean = false;

  @Input()
  id: string = '';

  ngOnInit() {

  }
}