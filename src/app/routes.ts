import { ItemDetailComponent } from './item-detail.component';
import { SearchComponent } from './search.component';
import { NotFoundComponent } from './not-found.component';
import { HomeComponent } from './home/home.component';

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
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];