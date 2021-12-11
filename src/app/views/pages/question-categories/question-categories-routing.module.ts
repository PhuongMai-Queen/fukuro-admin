import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionCategoriesComponent } from './question-categories.component';
import { CreateQuestionCategoryComponent } from './create-question-category/create-question-category.component';
import { QuestionCategoryListComponent } from './question-category-list/question-category-list.component';
import { EditQuestionCategoryComponent } from './edit-question-category/edit-question-category.component';

const routes: Routes = [{
  path: '',
  component: QuestionCategoriesComponent,
  children: [
    {
      path: 'list',
      component: QuestionCategoryListComponent,
    },
    {
      path: 'create',
      component: CreateQuestionCategoryComponent,
    },
    {
      path: 'edit/:id',
      component: EditQuestionCategoryComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionCategoriesRoutingModule { }

export const routedComponents = [
  QuestionCategoriesComponent,
  QuestionCategoryListComponent,
  CreateQuestionCategoryComponent,
  EditQuestionCategoryComponent,
];
