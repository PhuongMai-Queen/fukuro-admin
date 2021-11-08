import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogsComponent } from './blogs.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';

const routes: Routes = [{
  path: '',
  component: BlogsComponent,
  children: [
    {
      path: 'list',
      component: BlogListComponent,
    },
    {
      path: 'create',
      component: CreateBlogComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogsRoutingModule { }

export const routedComponents = [
  BlogsComponent,
  BlogListComponent,
  CreateBlogComponent,
];
