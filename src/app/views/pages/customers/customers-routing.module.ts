import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersComponent } from './customers.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';

const routes: Routes = [{
  path: '',
  component: CustomersComponent,
  children: [
    {
      path: 'list',
      component: CustomerListComponent,
    },
    {
      path: 'create',
      component: CreateCustomerComponent,
    },
    {
      path: 'edit/:id',
      component: EditCustomerComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule { }

export const routedComponents = [
  CustomersComponent,
  CustomerListComponent,
  CreateCustomerComponent,
  EditCustomerComponent
];
