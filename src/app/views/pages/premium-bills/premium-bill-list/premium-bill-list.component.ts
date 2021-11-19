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
        title: 'Tên hóa đơn',
        type: 'string',
      },
      price: {
        title: 'Giá tiền',
        type: 'string',
      },
      expire: {
        title: 'Thời hạn',
        type: 'string',
      },
      totalPrice: {
        title: 'Tổng tiền',
        type: 'string',
      },
      paymentStatus: {
        title: 'Trạng thái hoá đơn',
        type: 'string',
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
    this.premiumBillsService.getAll()
      .subscribe(
        data => {
          this.source = new LocalDataSource(data);
        },
        error => {
          console.log(error);
        });
  }

  onCustomAction(event) {
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.premiumBillsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrievePremiumBills();
              this.toastrService.success(response.message);
            },
            error => {
              this.toastrService.success(error);
            });
      }
    }
  }
}
