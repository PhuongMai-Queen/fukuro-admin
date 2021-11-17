import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogCategoriesComponent } from './blog-categories.component';
import { CreateBlogCategoryComponent } from './create-blog-category/create-blog-category.component';
import { BlogCategoryListComponent } from './blog-category-list/blog-category-list.component';
import { EditBlogCategoryComponent } from './edit-blog-category/edit-blog-category.component';

const routes: Routes = [{
  path: '',
  component: BlogCategoriesComponent,
  children: [
    {
      path: 'list',
      component: BlogCategoryListComponent,
    },
    {
      path: 'create',
      component: CreateBlogCategoryComponent,
    },
    {
      path: 'edit/:id',
      component: EditBlogCategoryComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogCategoriesRoutingModule { }

export const routedComponents = [
  BlogCategoriesComponent,
  BlogCategoryListComponent,
  CreateBlogCategoryComponent,
  EditBlogCategoryComponent,
];
