import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentalNewsComponent } from './rental-news.component';
import { RentalNewsListComponent } from './rental-news-list/rental-news-list.component';

const routes: Routes = [{
  path: '',
  component: RentalNewsComponent,
  children: [
    {
      path: 'list',
      component: RentalNewsListComponent,
    },
    ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalNewsRoutingModule { }

export const routedComponents = [
  RentalNewsComponent,
  RentalNewsListComponent,
];
