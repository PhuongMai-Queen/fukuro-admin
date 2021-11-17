import { Component, OnInit } from '@angular/core';
import {BlogCategories} from '../../../../models/blog-categories.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-create-blog-category',
  templateUrl: './edit-blog-category.component.html',
})
export class EditBlogCategoryComponent implements OnInit {
  blogCategories: BlogCategories = {
    name: '',
    status: '',
  };
  id: null;
  submitted = false;
  constructor(private blogCategoriesService: BlogCategoriesService, public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService)  {}
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getBlogCategory(this.id);
  }
  getBlogCategory(id): void {
    this.blogCategoriesService.get(id)
      .subscribe(
        data => {
          // this.source = new LocalDataSource(data);
          this.blogCategories = data;
        },
        error => {
          console.log(error);
        });
  }
  saveBlogCategory(): void {
    const data = {
      name: this.blogCategories.name,
      status: this.blogCategories.status,
    };
    // console.log(data);
    this.blogCategoriesService.update(this.id, data).subscribe(
      (response) => {
        this.toastrService.success(response.message);
      },
      (error) => {
        this.toastrService.error(error);
      });
  }
}
