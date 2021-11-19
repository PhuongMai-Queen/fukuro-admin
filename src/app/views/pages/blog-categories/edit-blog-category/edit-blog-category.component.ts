import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-edit-blog-category',
  templateUrl: './edit-blog-category.component.html',
})
export class EditBlogCategoryComponent implements OnInit {
  id: '';
  error = '';
  submitted = false;
  constructor(private blogCategoriesService: BlogCategoriesService, public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService)  {}
  blogCategories = this.fb.group(
    {
      name: ['', Validators.compose([Validators.required])],
      status: ['']});
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getBlogCategory(this.id);
  }
  get f() {
    return this.blogCategories.controls;
  }
  getBlogCategory(id): void {
    this.blogCategoriesService.get(id)
      .subscribe(
        data => {
          // this.source = new LocalDataSource(data);
          this.blogCategories = this.fb.group(
            {
              name: [data.name],
              status: [data.status]});
        },
        error => {
          console.log(error);
        });
  }
  updateBlogCategories(): any {
    this.submitted = true;

    // return validators
    if (this.blogCategories.invalid) {
      return false;
    }
    this.blogCategoriesService.update(this.id, this.blogCategories.value).subscribe(
      (response) => {
        this.toastrService.success(response.message);
      },
      (error) => {
        this.toastrService.error(error);
      });
  }
}
