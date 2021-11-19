import { Component, OnInit } from '@angular/core';
import {BlogCategories} from '../../../../models/blog-categories.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
  blogCategories: BlogCategories = {
    name: '',
    status: '',
  };
  submitted = false;
  constructor(private blogCategoriesService: BlogCategoriesService,
              public fb: FormBuilder,
              private toastrService: ToastrService,
  ) {}
  ngOnInit(): void {}
  saveBlogCategories(): void {
    const data = {
      name: this.blogCategories.name,
      status: this.blogCategories.status,
    };
    // console.log(data);
    this.blogCategoriesService.create(data).subscribe(
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
    this.blogCategories = {
      name: '',
      status: '',
    };
  }
}
