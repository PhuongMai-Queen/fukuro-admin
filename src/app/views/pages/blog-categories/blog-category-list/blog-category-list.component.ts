import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import {BlogCategories} from '../../../../models/blog-categories.model';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-blog-category-list',
  templateUrl: './blog-category-list.component.html',
  styleUrls: ['./blog-category-list.component.scss'],
})
export class BlogCategoryListComponent implements OnInit {
  blogCategories?: BlogCategories[];
  currentBlogCategories: BlogCategories = {};
  limit: 6;
  settings = {
    actions: {
      custom: [
        {
          name: 'edit',
          title: '<i class="nb-edit text-success" title="Edit"></i>'
        },
        {
          name: 'delete',
          title: '<i class="nb-trash text-danger" title="delete"></i>'
        },
      ],
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },
    columns: {
      name: {
        title: 'Tên loại',
        type: 'string',
      },
      slug: {
        title: 'Link',
        type: 'string',
      },
      status: {
        title: 'Trạng Thái',
        type: 'html',
        valuePrepareFunction: (value) => {
          return value == 1 ? 'Kích hoạt' : 'Vô hiệu hoá';
        },
      },
    },
  };

  source: LocalDataSource;

  constructor(private blogCategoriesService: BlogCategoriesService,
              private _router: Router,
              private toastrService: ToastrService,
  ) {}
  ngOnInit(): void {
    this.retrieveBlogCategories();
  }
  retrieveBlogCategories(): void {
    this.blogCategoriesService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.blogCategoriesService.getAll(this.limit)
            .subscribe(
              res => {
                this.source = new LocalDataSource(res['rows']);
              });
        },
        error => {
          console.log(error);
        });
  }

  onCustomAction(event) {
    if(event.action == 'edit'){
      this._router.navigate(['pages/blog-categories/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.blogCategoriesService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrieveBlogCategories();
              this.toastrService.success(response.message);
            },
            error => {
              this.toastrService.success(error);
            });
      }
    }
  }
}
