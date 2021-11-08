import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsComponent } from './admins.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { AdminListComponent } from './admin-list/admin-list.component';

const routes: Routes = [{
  path: '',
  component: AdminsComponent,
  children: [
    {
      path: 'list',
      component: AdminListComponent,
    },
    {
      path: 'create',
      component: CreateAdminComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminsRoutingModule { }

export const routedComponents = [
  AdminsComponent,
  AdminListComponent,
  CreateAdminComponent,
];
