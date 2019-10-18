import { Component, OnInit } from '@angular/core';

import { ApiService } from './api.service';

@Component( {
  selector: 'search',
  templateUrl: 'search.component.html',
} )
export class SearchComponent implements OnInit {

  items: any[];

  constructor( private apiService: ApiService ) { };

  query;

  search( form ) {
    console.log( form.query );
    this.apiService.getItems( form.query ).subscribe( res => {
      this.items = [];
      this.items = res.findItemsByKeywordsResponse[ 0 ].searchResult[ 0 ].item || [];
      this.items.forEach( function ( item ) { console.log( item.itemId[ 0 ] + item.galleryURL ) } );
      console.log( this.items.length );
    } )
  }

  ngOnInit() {
    this.apiService.getItems( 'watches' ).subscribe( res => {
      //console.log( JSON.stringify( res ) );
      this.items = res.findItemsByKeywordsResponse[ 0 ].searchResult[ 0 ].item || [];
      console.log( this.items[ 0 ] );
    } )
  }
}