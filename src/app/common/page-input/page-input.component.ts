import { Component, Input, forwardRef, OnInit, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component( {
  selector: 'page-input',
  templateUrl: 'page-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( () => PageInputComponent ),
      multi: true
    }
  ]
} )
export class PageInputComponent implements ControlValueAccessor, OnInit, OnChanges {

  @Input()
  totalPages: number;

  @Input()
  currentPage: number;

  @Input()
  toDisplay: number = 8;

  private onChange_ = ( _: any ) => { }
  private value_: number;

  pages: number[] = [];

  get value() {
    return this.value_;
  }

  set value( value: number ) {
    this.value_ = value;
    this.onChange_( this.value );
  }

  writeValue( value: number ): void {
    this.value = value;
  }

  registerOnChange( fn: any ): void {
    this.onChange_ = fn;
  }

  registerOnTouched( fn: any ): void { }

  setPages( currentPage: number, totalPages: number, toDisplay: number ) {
    let minPage = currentPage - Math.floor( toDisplay / 2 );
    let maxPage = currentPage + Math.floor( toDisplay / 2 );
    let extraLeft = Math.max( minPage * -1 + 1, 0 );
    let extraRight = Math.max( maxPage - totalPages, 0 );

    maxPage = Math.min( maxPage + extraLeft, totalPages );
    minPage = Math.max( 1, minPage - extraRight );

    this.pages = [];
    for ( let i = minPage; i <= maxPage; i++ ) {
      this.pages.push( i );
    }
    console.log( typeof ( this.currentPage ) );
  }

  toPage( page: number ) {
    this.value = page;
  }

  next() {
    this.value++;
  }

  prev() {
    this.value--;
  }

  ngOnInit() {
    this.setPages( this.value, this.totalPages, this.toDisplay );
  }

  ngOnChanges() {
    this.setPages( this.value, this.totalPages, this.toDisplay );
  }

}