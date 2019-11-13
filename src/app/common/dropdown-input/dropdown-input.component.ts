import { Component, Input, forwardRef } from '@angular/core';
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
export class DropdownInputComponent implements ControlValueAccessor {

  @Input()
  items: Map<string, Array<string>>;

  @Input()
  defaultText: string = 'Select Item';

  @Input()
  submit: boolean = false;

  @Input()
  menuRight: boolean = false;

  @Input()
  inputAppend: boolean = false;

  private onChange = ( _: any ) => { };
  private _value;

  get value() {
    return this._value;
  }

  set value( value: string ) {
    this._value = value;
    this.onChange( this._value );
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
    this.onChange( this._value );
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
}