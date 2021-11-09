import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import {Blogs} from '../../../../models/blogs.model';
import {BlogsService} from '../../../../services/blogs.service';

@Component({
  selector: 'ngx-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent {
  blogs?: Blogs[];
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
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      title: {
        title: 'Tên bài viết',
        type: 'number',
      },
      thumbnail: {
        title: 'Hình ảnh',
        type: 'string',
      },
      summary: {
        title: 'Tóm tắt bài viết',
        type: 'string',
      },
      status: {
        title: 'Trang thái',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private blogsService: BlogsService) {}

  ngOnInit(): void {
    this.retrieveBlogs();
  }
  retrieveBlogs(): void {
    this.blogsService.getAll()
      .subscribe(
        data => {
          this.source = new LocalDataSource(data);
          // console.log(data);
        },
        error => {
          // console.log(error);
        });
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
