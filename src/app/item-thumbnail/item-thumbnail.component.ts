import { Component, Input, OnInit } from '@angular/core';

import { ApiService, IItem } from '../common/api.service';
import { IsoCountryService } from '../common/iso-country.service';

@Component( {
  selector: 'item-thumbnail',
  templateUrl: 'item-thumbnail.component.html',
  styleUrls: [ 'item-thumbnail.component.css' ]
} )
export class ItemThumbnailComponent implements OnInit {
  @Input()
  item: IItem;

  @Input()
  index: number;

  expanded: boolean = false;
  fetched: boolean = false;
  gallery: string[] = [];
  countryName: string;

  constructor( private apiService: ApiService, private isoCountryService: IsoCountryService ) { }

  toggleExpand() {
    if ( !this.fetched ) {
      this.fetched = true;
      this.apiService.getItemPictures( this.item.itemId ).subscribe( res => {
        this.gallery = res.body;
      } );
    }
    this.expanded = !this.expanded;
  }

  ngOnInit() {
    this.countryName = this.isoCountryService.country( this.item.country );
  }

}