import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {PremiumsService} from '../../../../services/premiums.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-premiums-list',
  templateUrl: './premiums-list.component.html',
  styleUrls: ['./premiums-list.component.scss'],
})
export class PremiumsListComponent implements OnInit {
  limit: 6;
  settings = {
    actions: {
      custom: [
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
        title: 'Tên premium',
        type: 'number',
      },
      price: {
        title: 'Giá tiền',
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

  constructor(private premiumsService: PremiumsService,
              private _router: Router,
              private toastrService: ToastrService,
              public datepipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.retrievePremiums();
  }
  retrievePremiums(): void {
    this.premiumsService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.premiumsService.getAll(this.limit)
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
      this._router.navigate(['pages/premiums/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.premiumsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrievePremiums();
              this.toastrService.success('Xóa thành công!');
            },
            error => {
              this.toastrService.error('Không thể xóa!');
            });
      }
    }
  }
}
