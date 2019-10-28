import { ItemDetailComponent } from './item-detail.component';
import { SearchComponent } from './search.component';
import { NotFoundComponent } from './not-found.component';

export const appRoutes = [
  {
    path: 'item/:id',
    component: ItemDetailComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];