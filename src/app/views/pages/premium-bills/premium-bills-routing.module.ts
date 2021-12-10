import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PremiumBillsComponent } from './premium-bills.component';
import { PremiumBillListComponent } from './premium-bill-list/premium-bill-list.component';
import { EditPremiumBillComponent } from './edit-premium-bill/edit-premium-bill.component';

const routes: Routes = [{
  path: '',
  component: PremiumBillsComponent,
  children: [
    {
      path: 'list',
      component: PremiumBillListComponent,
    },
    {
      path: 'edit/:id',
      component: EditPremiumBillComponent,
    },
    ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PremiumBillsRoutingModule { }

export const routedComponents = [
  PremiumBillsComponent,
  PremiumBillListComponent,
  EditPremiumBillComponent
];
