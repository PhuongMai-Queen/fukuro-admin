import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsComponent } from './notifications.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
const routes: Routes = [{
  path: '',
  component: NotificationsComponent,
  children: [
    {
      path: 'list',
      component: NotificationListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {
}
export const routedComponents = [
  NotificationsComponent,
  NotificationListComponent,
];
