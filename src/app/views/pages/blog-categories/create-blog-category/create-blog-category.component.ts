import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-create-blog-category',
  templateUrl: './create-blog-category.component.html',
})
export class CreateBlogCategoryComponent implements OnInit {
  error = '';
  submitted = false;
  constructor(private blogCategoriesService: BlogCategoriesService,
              public fb: FormBuilder,
              private toastrService: ToastrService,
  ) {}
  blogCategories = this.fb.group(
    {
      name: ['', Validators.compose([Validators.required])],
      status: ['']});
  ngOnInit(): void {}
  get f() {
    return this.blogCategories.controls;
  }
  saveBlogCategories(): any {
    this.submitted = true;
    // return validators
    if (this.blogCategories.invalid) {
      return false;
    }
    this.blogCategoriesService.create(this.blogCategories.value).subscribe(
      (response) => {
        this.newBlogCategory();
        this.toastrService.success('Thêm mới thành công!');
      },
      (error) => {
        console.log(error);
      });
  }
  newBlogCategory(): void {
    this.submitted = false;
    this.blogCategories = this.fb.group(
      {
        name: [''],
        status: ['']});
  }
}
