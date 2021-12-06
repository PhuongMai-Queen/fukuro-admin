import {Component, OnInit} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import {Blogs} from '../../../../models/blogs.model';
import {BlogsService} from '../../../../services/blogs.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'ngx-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  blogs?: Blogs[];
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
      thumbnail: {
        title: 'Hình ảnh',
        filter: false,
        type: 'html',
        valuePrepareFunction: (thumbnail) => {
          return `<img class='table-thumbnail-img' src="${thumbnail}" width="120px" />`
        },
      },
      title: {
        title: 'Tên bài viết',
        type: 'number',
      },
      status: {
        title: 'Trạng Thái',
        type: 'html',
        valuePrepareFunction: (value) => {
          return value == 1 ? 'Đăng' : 'Bản nháp';
        },
      },
    },
  };
  limit: 6;

  source: LocalDataSource = new LocalDataSource();

  constructor(private blogsService: BlogsService, private _router: Router, private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.retrieveBlogs();
  }
  retrieveBlogs(): void {
    this.blogsService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.blogsService.getAll(this.limit)
            .subscribe(
              res => {
                for (var i = 0; i < res['rows'].length; i++) {
                  res['rows'][i].thumbnail = environment.linkImg+res['rows'][i].thumbnail;
                }
                this.source = new LocalDataSource(res['rows']);
              });
        },
        error => {
          console.log(error);
        });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  onCustomAction(event) {
    if(event.action == 'edit'){
      this._router.navigate(['pages/blogs/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.blogsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrieveBlogs();
              this.toastrService.success(response.message);
            },
            error => {
              this.toastrService.success(error);
            });
      }
    }
  }
}
