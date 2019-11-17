import { Component, Input, OnInit } from '@angular/core';

import { ApiService } from '../common/api.service';

@Component( {
  selector: 'item-thumbnail',
  templateUrl: 'item-thumbnail.component.html',
  styleUrls: [ 'item-thumbnail.component.css' ]
} )
export class ItemThumbnailComponent implements OnInit {
  @Input() item;
  @Input() index;

  expanded: boolean = false;
  fetched: boolean = false;
  gallery: string[] = [];
  thumbnailUrl: string;

  constructor( private apiService: ApiService ) { }

  toggleExpand() {
    if ( !this.fetched ) {
      this.fetched = true;
      this.apiService.getItem( this.item.itemId ).subscribe( res => {
        this.gallery = res.PictureURL;
      } );
    }
    this.expanded = !this.expanded;
  }

  ngOnInit() {
    if ( this.item.pictureURLSuperSize != undefined ) {
      this.thumbnailUrl = this.item.pictureURLSuperSize[ 0 ];
    } else if ( this.item.pictureURLLarge != undefined ) {
      this.thumbnailUrl = this.item.pictureURLLarge[ 0 ];
    } else if ( this.item.galleryURL != undefined ) {
      this.thumbnailUrl = this.item.galleryURL[ 0 ];
    } else {
      this.thumbnailUrl = 'https://thumbs1.ebaystatic.com/pict/04040_0.jpg';
    }
  }

}