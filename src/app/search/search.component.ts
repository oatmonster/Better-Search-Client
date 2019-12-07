import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { IQuery, ISearchResult } from '../common/api.service';
import { staggerList } from '../common/animations';
import { SearchService } from '../common/search.service';

@Component( {
  selector: 'search',
  templateUrl: 'search.component.html',
  styleUrls: [ 'search.component.css' ],
  animations: [ staggerList ]
} )
export class SearchComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService
  ) { }

  results: ISearchResult;
  currentState: IQuery;
  validSearch: boolean = true;

  sortings: Map<string, string> = new Map();
  types: Map<string, string> = new Map();
  conditions: Map<string, string> = new Map();
  categories: Map<string, string> = new Map();

  searchForm = new FormGroup( {
    query: new FormControl(),
    page: new FormControl(),
    sortBy: new FormControl(),
    listType: new FormControl(),
    category: new FormControl(),
    condition: new FormControl(),
  } );

  submit() {
    this.searchService.navigate( this.searchForm.value, this.currentState || this.searchForm.value );
  }

  changeListType( newListType: string ) {
    this.searchForm.patchValue( { listType: newListType } );
    this.submit();
  }

  ngOnInit() {

    this.searchService.getCategories().subscribe( categories => {
      this.categories = categories;
    } );

    this.sortings = this.searchService.getSortings();
    this.types = this.searchService.getTypes();

    this.activatedRoute.paramMap.subscribe(
      params => {
        if ( !params.has( 'query' ) || params.get( 'query' ).trim() == '' ) {
          this.router.navigateByUrl( '' );
        } else {
          this.searchForm.patchValue( { query: params.get( 'query' ).trim() } );

          // Make query from url params, don't even bother to validate
          let query: IQuery = { query: params.get( 'query' ).trim() };

          if ( params.has( 'page' ) ) query.page = +params.get( 'page' );

          if ( params.has( 'sortBy' ) ) query.sortBy = params.get( 'sortBy' );

          if ( params.has( 'listType' ) ) query.listType = params.get( 'listType' );

          if ( params.has( 'category' ) ) query.category = params.get( 'category' );

          if ( params.has( 'condition' ) ) query.condition = params.get( 'condition' );

          this.searchService.search( query ).subscribe(
            res => {
              this.validSearch = true;
              window.scroll( 0, 0 );
              this.currentState = {
                query: query.query,
                page: res.pagination.page,
                sortBy: query.sortBy || '0',
                listType: query.listType || '0',
                category: query.category || '0',
                condition: query.condition || '0'
              };

              this.results = res;
              this.results.pagination.totalPages = Math.min( 100, this.results.pagination.totalPages );

              this.searchForm.patchValue( this.currentState );
              this.searchService.getConditions( this.currentState.category ).subscribe(
                conditions => {
                  this.conditions = conditions;
                },
                err => {
                  console.error( 'Get conditions error' );
                  throw new Error( 'Failed to get conditions' )
                }
              );
            },
            err => {
              console.error( 'Search failed' );
              this.currentState = undefined;
              this.searchForm.reset();
              this.validSearch = false;
            }
          );
        }
      }
    );
  }
}