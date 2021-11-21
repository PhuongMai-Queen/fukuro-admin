import {Component, OnInit} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {CustomersService} from '../../../../services/customers.service';
import {Router} from '@angular/router';
import {Customers} from '../../../../models/customers.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  customers?: Customers[];
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
      avatar: {
        title: 'Hình ảnh',
        filter: false,
        type: 'html',
        valuePrepareFunction: (avatar) => {
          return `<img class='table-thumbnail-img' src="${avatar}" width="80px"/>`
        },
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      phone: {
        title: 'Điện thoại',
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

  constructor(private customersService: CustomersService,
              private _router: Router,
              private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.retrieveCustomers();
  }

  retrieveCustomers(): void {
    this.customersService.getAll()
      .subscribe(
        data => {
          this.source = new LocalDataSource(data['rows']);
        },
        error => {
          console.log(error);
        });
  }

  onCustomAction(event) {
    if(event.action == 'edit'){
      this._router.navigate(['/pages/customers/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.customersService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrieveCustomers();
              this.toastrService.success(response.message);
            },
            error => {
              this.toastrService.success(error);
            });
      }
    }
  }
}
