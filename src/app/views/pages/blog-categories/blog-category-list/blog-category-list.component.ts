import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import {BlogCategories} from '../../../../models/blog-categories.model';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';
import { EditBlogCategoryComponent } from '../edit-blog-category/edit-blog-category.component';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-blog-category-list',
  templateUrl: './blog-category-list.component.html',
  styleUrls: ['./blog-category-list.component.scss'],
})
export class BlogCategoryListComponent implements OnInit {
  blogCategories?: BlogCategories[];
  currentBlogCategories: BlogCategories = {};

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Tên loại',
        type: 'string',
      },
      status: {
        title: 'Trạng Thái',
        type: 'string',
      },
    },
  };

  source: LocalDataSource;

  constructor(private blogCategoriesService: BlogCategoriesService, private _router: Router,) {}
  ngOnInit(): void {
    this.retrieveTutorials();
  }
  retrieveTutorials(): void {
    this.blogCategoriesService.getAll()
      .subscribe(
        data => {
          this.source = new LocalDataSource(data);
          // console.log(data);
        },
        error => {
          // console.log(error);
        });
  }

  onAddClient(data){
    console.log(data);
    this._router.navigate(['/pages/blog-categories/create']);
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    console.log(event);
    // if (window.confirm('Are you sure you want to delete?')) {
    //   event.confirm.resolve();
    // } else {
    //   event.confirm.reject();
    // }
  }
}
