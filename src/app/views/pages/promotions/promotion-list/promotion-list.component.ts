import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {PromotionsService} from '../../../../services/promotions.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss'],
})
export class PromotionListComponent implements OnInit {
  limit: 6;
  settings = {
    actions: {
      custom: [
        // {
        //   name: 'info',
        //   title: '<i class="nb-cloudy text-primary" title="Chi tiết"></i>'
        // },
        {
          name: 'edit',
          title: '<i class="nb-edit text-success" title="Sửa"></i>'
        },
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
        title: 'Tên khuyến mãi',
        type: 'number',
      },
      discount: {
        title: 'Giảm giá (%)',
        type: 'string',
      },
      startDate: {
        title: 'Ngày bắt đầu',
        type: 'string',
      },
      endDate: {
        title: 'Ngày kết thúc',
        type: 'string',
      },
    },
  };

  source: LocalDataSource;

  constructor(private promotionsService: PromotionsService,
              private _router: Router,
              private toastrService: ToastrService,
              public datepipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.retrievePromotions();
  }
  retrievePromotions(): void {
    this.promotionsService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.promotionsService.getAll(this.limit)
            .subscribe(
              res => {
                for (var i = 0; i < res['rows'].length; i++) {
                  res['rows'][i].startDate = this.datepipe.transform(res['rows'][i].startDate, 'yyyy-MM-dd');
                  res['rows'][i].endDate = this.datepipe.transform(res['rows'][i].endDate, 'yyyy-MM-dd');
                }
                this.source = new LocalDataSource(res['rows']);
              });
        },
        error => {
          console.log(error);
        });
  }

  onCustomAction(event) {
    if(event.action == 'edit'){
      this._router.navigate(['pages/promotions/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.promotionsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrievePromotions();
              this.toastrService.success('Xóa thành công!');
            },
            error => {
              this.toastrService.error('Không thể xóa!');
            });
      }
    }
  }
}
