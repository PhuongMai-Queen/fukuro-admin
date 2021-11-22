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

  settings = {
    actions: {
      custom: [
        {
          name: 'info',
          title: '<i class="nb-cloudy text-primary" title="Chi tiết"></i>'
        },
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
    this.promotionsService.getAll()
      .subscribe(
        data => {
          for (var i = 0; i < data['rows'].length; i++){
            data['rows'][i].startDate = this.datepipe.transform(data['rows'][i].startDate, 'yyyy-MM-dd');
            data['rows'][i].endDate = this.datepipe.transform(data['rows'][i].endDate, 'yyyy-MM-dd');
          }
          this.source = new LocalDataSource(data['rows']);
        },
        error => {
          console.log(error);
        });
  }

  onCustomAction(event) {
    if(event.action == 'info'){
      this._router.navigate(['pages/promotions/info/'+event.data['id']]);
    }
    if(event.action == 'edit'){
      this._router.navigate(['pages/promotions/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.promotionsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrievePromotions();
              this.toastrService.success(response.message);
            },
            error => {
              this.toastrService.success(error);
            });
      }
    }
  }
}
