import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import {QuestionCategoriesService} from '../../../../services/question-categories.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-question-category-list',
  templateUrl: './question-category-list.component.html',
  styleUrls: ['./question-category-list.component.scss'],
})
export class QuestionCategoryListComponent implements OnInit {
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
        title: 'Tên chuyên mục hỏi đáp',
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

  constructor(private questionCategoriesService: QuestionCategoriesService,
              private _router: Router,
              private toastrService: ToastrService,
  ) {}
  ngOnInit(): void {
    this.retrieveBlogCategories();
  }
  retrieveBlogCategories(): void {
    this.questionCategoriesService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.questionCategoriesService.getAll(this.limit)
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
      this._router.navigate(['pages/question-categories/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.questionCategoriesService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrieveBlogCategories();
              this.toastrService.success('Xóa thành công!');
            },
            error => {
              this.toastrService.error('Không thể xóa!');
            });
      }
    }
  }
}
