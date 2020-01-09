import { Component, Input, forwardRef, OnInit, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ICategory, ApiService } from 'src/app/common/api.service';
import { fadeIn } from 'src/app/common/animations';

@Component( {
  selector: 'category-input',
  templateUrl: 'category-input.component.html',
  styleUrls: [ 'category-input.component.css' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( () => CategoryInputComponent ),
      multi: true
    }
  ],
  animations: [ fadeIn ],
} )
export class CategoryInputComponent implements ControlValueAccessor, OnInit, OnChanges {

  constructor( private apiService: ApiService ) { }

  @Input()
  histogram: {
    category: ICategory,
    count: number,
    childCategoryHistogram: {
      category: ICategory,
      count: number,
    }[],
  }[];

  @Input()
  currentCategoryId: string

  private parents: ICategory[];
  private currentCategory: ICategory;
  private onChange_ = ( category ) => { }
  private category;
  private totalCount: number;

  get value() {
    return this.category;
  }

  set value( value: string ) {
    this.category = value;
    this.onChange_( this.category );

  }

  writeValue( value: string ): void {
    this.value = value;
  }

  registerOnChange( fn: any ): void {
    this.onChange_ = fn;
  }

  registerOnTouched( fn: any ): void { }

  update() {
    if ( this.value !== undefined ) {
      this.parents = undefined;
      this.apiService.getCategoryParents( this.value ).subscribe( res => {
        this.parents = res;
      } );
    }
    if ( this.histogram ) {
      let count = 0;
      this.histogram.forEach( category => {
        count += category.count;
      } );
      this.totalCount = count;
    }
    if ( this.currentCategoryId && this.currentCategoryId !== '0' ) {
      this.apiService.getCategory( this.currentCategoryId ).subscribe( res => {
        this.currentCategory = res;
      } );
    }
  }

  selectCategory( categoryId: string ) {
    this.value = categoryId;
  }

  ngOnInit() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }
}