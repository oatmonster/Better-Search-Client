import { Component, Input, OnInit } from '@angular/core';

@Component( {
  selector: 'item-thumbnail',
  templateUrl: 'item-thumbnail.component.html',
  styles: [ `
    .thumbnail {
      object-fit: cover;
      width: 150px;
      height: 150px;
    }
  `]
} )
export class ItemThumbnailComponent implements OnInit {
  @Input() item;

  ngOnInit() {
    if ( this.item.galleryURL === undefined ) {
      this.item.galleryURL = [ 'https://thumbs1.ebaystatic.com/pict/04040_0.jpg' ];
    }
  }

}