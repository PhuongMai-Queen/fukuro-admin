import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [{
  path: '',
  component: ProfileComponent,
  children: [
    {
      path: 'change-password/:id',
      component: ChangePasswordComponent,
    },
    {
      path: 'update-profile/:id',
      component: UpdateProfileComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }

export const routedComponents = [
  ProfileComponent,
  ChangePasswordComponent,
  UpdateProfileComponent,
];
