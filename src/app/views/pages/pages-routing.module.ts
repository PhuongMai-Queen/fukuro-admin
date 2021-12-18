import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'blog-categories',
      loadChildren: () => import('./blog-categories/blog-categories.module')
        .then(m => m.BlogCategoriesModule),
    },
    {
      path: 'question-categories',
      loadChildren: () => import('./question-categories/question-categories.module')
        .then(m => m.QuestionCategoriesModule),
    },
    {
      path: 'blogs',
      loadChildren: () => import('./blogs/blogs.module')
        .then(m => m.BlogsModule),
    },
    {
      path: 'customers',
      loadChildren: () => import('./customers/customers.module')
        .then(m => m.CustomersModule),
    },
    {
      path: 'admins',
      loadChildren: () => import('./admins/admins.module')
        .then(m => m.AdminsModule),
    },
    {
      path: 'promotions',
      loadChildren: () => import('./promotions/promotions.module')
        .then(m => m.PromotionsModule),
    },
    {
      path: 'rental-news',
      loadChildren: () => import('./rental-news/rental-news.module')
        .then(m => m.RentalNewsModule),
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile/profile.module')
        .then(m => m.ProfileModule),
    },
    {
      path: 'contacts',
      loadChildren: () => import('./contacts/contacts.module')
        .then(m => m.ContactsModule),
    },
    {
      path: 'premium-bills',
      loadChildren: () => import('./premium-bills/premium-bills.module')
        .then(m => m.PremiumBillsModule),
    },
    {
      path: 'premiums',
      loadChildren: () => import('./premiums/premiums.module')
        .then(m => m.PremiumsModule),
    },
    {
      path: 'notifications',
      loadChildren: () => import('./notifications/notifications.module')
        .then(m => m.NotificationsModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
