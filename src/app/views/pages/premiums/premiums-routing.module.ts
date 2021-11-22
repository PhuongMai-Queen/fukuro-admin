import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PremiumsComponent } from './premiums.component';
import { CreatePremiumsComponent } from './create-premiums/create-premiums.component';
import { EditPremiumsComponent } from './edit-premiums/edit-premiums.component';
import { PremiumsListComponent } from './premiums-list/premiums-list.component';

const routes: Routes = [{
  path: '',
  component: PremiumsComponent,
  children: [
    {
      path: 'list',
      component: PremiumsListComponent,
    },
    {
      path: 'create',
      component: CreatePremiumsComponent,
    },
    {
      path: 'edit/:id',
      component: EditPremiumsComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PremiumsRoutingModule { }

export const routedComponents = [
  PremiumsComponent,
  PremiumsListComponent,
  CreatePremiumsComponent,
  EditPremiumsComponent,
];
