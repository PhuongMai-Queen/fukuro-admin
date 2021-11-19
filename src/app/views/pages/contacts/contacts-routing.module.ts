import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsComponent } from './contacts.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';

const routes: Routes = [{
  path: '',
  component: ContactsComponent,
  children: [
    {
      path: 'list',
      component: ContactsListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule { }

export const routedComponents = [
  ContactsComponent,
  ContactsListComponent,
];
