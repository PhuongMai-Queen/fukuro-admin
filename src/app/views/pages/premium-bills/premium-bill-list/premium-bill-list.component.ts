import {Component, OnInit} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {PremiumBillsService} from '../../../../services/premium-bills.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-premium-bill-list',
  templateUrl: './premium-bill-list.component.html',
  styleUrls: ['./premium-bill-list.component.scss'],
})
export class PremiumBillListComponent implements OnInit {
  limit: 6;
  status: 'both';
  settings = {
    actions: {
      custom: [
        {
          name: 'edit',
          title: '<i class="nb-edit text-success" title="Edit"></i>'
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
      id: {
        title: 'ID',
        type: 'number',
      },
      // name: {
      //   title: 'Tên hóa đơn',
      //   type: 'string',
      // },
      price: {
        title: 'Giá tiền',
        type: 'string',
      },
      expire: {
        title: 'Thời hạn (tháng)',
        type: 'string',
      },
      totalPrice: {
        title: 'Tổng tiền',
        type: 'string',
      },
      paymentStatus: {
        title: 'Trạng thái hoá đơn',
        type: 'html',
        valuePrepareFunction: (value) => {
          return value == 1 ? 'Đã thanh toán' : 'Chưa thanh toán';
        },
      },
      status: {
        title: 'Trạng thái hoá đơn',
        type: 'html',
        valuePrepareFunction: (value) => {
          return value == 1 ? 'Hoàn thành' : 'Đang xử lý';
        },
      },
    },
  };

  source: LocalDataSource;

  constructor(private premiumBillsService: PremiumBillsService,
              private _router: Router,
              private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.retrievePremiumBills();
  }
  retrievePremiumBills(): void {
    this.premiumBillsService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.premiumBillsService.getAll(this.limit)
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
      this._router.navigate(['pages/premium-bills/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.premiumBillsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrievePremiumBills();
              this.toastrService.success('Xóa thành công!');
            },
            error => {
              this.toastrService.error('Không thể xóa!');
            });
      }
    }
  }
}
