import {Component, OnInit} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {RentalNewsService} from '../../../../services/rental-news.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-rental-news-list',
  templateUrl: './rental-news-list.component.html',
  styleUrls: ['./rental-news-list.component.scss'],
})
export class RentalNewsListComponent implements OnInit {
  limit: 6;
  settings = {
    actions: {
      custom: [
        {
          name: 'delete',
          title: '<i class="nb-trash text-danger" title="Xoá"></i>'
        },
      ],
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },
    columns: {
      name: {
        title: 'Tên nhà trọ',
        type: 'string',
      },
      price: {
        title: 'Giá',
        type: 'string',
      },
      quantity: {
        title: 'Số lượng',
        type: 'string',
      },
      address: {
        title: 'Địa chỉ',
        type: 'string',
      },
      status: {
        title: 'Trạng Thái',
        type: 'html',
        valuePrepareFunction: (value) => {
          return value == 1 ? 'Còn phòng' : 'Hết phòng';
        },
      },
    },
  };

  source: LocalDataSource;

  constructor(private rentalNewsService: RentalNewsService,
              private _router: Router,
              private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.retrieveRentalNews();
  }
  retrieveRentalNews(): void {
    this.rentalNewsService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.rentalNewsService.getAll(this.limit)
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
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.rentalNewsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrieveRentalNews();
              this.toastrService.success(response.message);
            },
            error => {
              this.toastrService.success(error);
            });
      }
    }
  }
}
