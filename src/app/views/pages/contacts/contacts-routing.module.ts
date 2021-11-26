import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsComponent } from './contacts.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [{
  path: '',
  component: ContactsComponent,
  children: [
    {
      path: 'list',
      component: ContactsListComponent,
    },
    {
      path: 'info/:id',
      component: ContactDetailComponent,
    },
    {
      path: 'feedback/:id',
      component: FeedbackComponent,
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
  ContactDetailComponent,
  FeedbackComponent,
];
