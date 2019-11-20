import { Component, Input, forwardRef, OnInit, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component( {
  selector: 'dropdown-input',
  templateUrl: 'dropdown-input.component.html',
  styleUrls: [ 'dropdown-input.component.css' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( () => DropdownInputComponent ),
      multi: true
    }
  ]
} )
export class DropdownInputComponent implements ControlValueAccessor, OnInit, OnChanges {

  @Input()
  itemMap: Map<string, string>;

  @Input()
  defaultText: string = 'Select Item';

  @Input()
  submit: boolean = false;

  @Input()
  menuRight: boolean = false;

  @Input()
  inputAppend: boolean = false;

  items: Map<string, Array<string>> = new Map();

  private onChange = ( _: any ) => { };
  private value_;

  get value() {
    return this.value_;
  }

  set value( value: string ) {
    this.value_ = value;
    this.onChange( this.value_ );
  }

  writeValue( value: string ): void {
    this.value = value;
  }

  registerOnChange( fn: any ): void {
    this.onChange = fn;
  }

  registerOnTouched( fn: any ): void { }

  selectItem( item ): void {
    this.value = item.key;
    this.onChange( this.value_ );
  }

  selected(): string {
    if ( this.value && this.items ) {
      if ( this.items.get( this.value ) ) return this.items.get( this.value )[ 0 ];
    }
    return this.defaultText;

  }

  sortMapInOrder( a, b ) {
    return +a.value[ 1 ] > +b.value[ 1 ] ? 1 : ( +b.value[ 1 ] > +a.value[ 1 ] ? -1 : 0 );
  }

  updateItems() {
    if ( this.itemMap ) {
      this.items.clear();
      let index = 0;
      this.itemMap.forEach( ( val, key ) => {
        this.items.set( key, [ val, '' + index ] );
        index++;
      } );
    }
  }

  ngOnChanges() {
    this.updateItems();
  }

  ngOnInit() {
    this.updateItems();
  }
}