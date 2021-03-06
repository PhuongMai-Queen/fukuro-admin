import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotionsComponent } from './promotions.component';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { EditPromotionComponent } from './edit-promotion/edit-promotion.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';

const routes: Routes = [{
  path: '',
  component: PromotionsComponent,
  children: [
    {
      path: 'list',
      component: PromotionListComponent,
    },
    {
      path: 'create',
      component: CreatePromotionComponent,
    },
    {
      path: 'edit/:id',
      component: EditPromotionComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionsRoutingModule { }

export const routedComponents = [
  PromotionsComponent,
  PromotionListComponent,
  CreatePromotionComponent,
  EditPromotionComponent,
];
