import { trigger, transition, style, animate, query, stagger } from '@angular/animations'

export const fadeOut = trigger( 'fadeOut',
  [
    transition(
      ':leave',
      [
        style( { opacity: 1 } ),
        animate( '500ms ease-in', style( { opacity: 0 } ) )
      ]
    )
  ]
);

export const staggerList = trigger( 'staggerList',
  [
    transition( '* => *', [ // each time the binding value changes
      query( ':enter', [
        style( { opacity: 0 } ),
        stagger( 100, [
          animate( '0.5s ease-out', style( { opacity: 1 } ) )
        ] )
      ], { optional: true } )
    ] )
  ]
);
