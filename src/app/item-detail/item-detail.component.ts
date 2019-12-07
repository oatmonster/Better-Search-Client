import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService, IItem } from '../common/api.service';
import { SearchService } from '../common/search.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component( {
  selector: 'item-detail',
  templateUrl: 'item-detail.component.html',
  styleUrls: [ 'item-detail.component.css' ]
} )
export class ItemDetailComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService
  ) { }

  item: IItem;

  categories: Map<string, string> = new Map();

  searchForm = new FormGroup( {
    query: new FormControl( '' ),
    category: new FormControl( '' ),
  } );

  submit() {
    this.searchService.navigate( this.searchForm.value, this.searchForm.value );
  }

  ngOnInit() {
    this.searchService.getCategories().subscribe( categories => {
      this.categories = categories;
    } );

    this.apiService.getItem( this.activatedRoute.snapshot.params[ 'id' ] ).subscribe( res => {
      this.item = res;
    } );
  }
}