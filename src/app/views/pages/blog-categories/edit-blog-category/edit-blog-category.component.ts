import { Component, OnInit } from '@angular/core';
import {BlogCategories} from '../../../../models/blog-categories.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';

@Component({
  selector: 'ngx-create-blog-category',
  templateUrl: './edit-blog-category.component.html',
})
export class EditBlogCategoryComponent implements OnInit {
  blogCategories: BlogCategories = {
    name: '',
    status: '',
  };
  submitted = false;
  constructor(private blogCategoriesService: BlogCategoriesService, public fb: FormBuilder) {}
  ngOnInit(): void {}
  saveBlogCategories(): void {
    const data = {
      name: this.blogCategories.name,
      status: this.blogCategories.status,
    };
    // console.log(data);
    this.blogCategoriesService.create(data).subscribe(
      (response) => {
        // console.log(response);
        this.submitted = true;
      },
      (error) => {
        // console.log(error);
      });
  }
}
