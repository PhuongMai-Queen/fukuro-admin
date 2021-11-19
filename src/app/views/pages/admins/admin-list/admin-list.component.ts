import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {ToastrService} from 'ngx-toastr';
import { SmartTableData } from '../../../@core/data/smart-table';
import {AdminsService} from '../../../../services/admins.service';
import {Router} from '@angular/router';
import {Admins} from '../../../../models/admins.model';

@Component({
  selector: 'ngx-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent {
  admins?: Admins[];
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
      // lastName: {
      //   title: 'Họ',
      //   type: 'string',
      // },
      // firstName: {
      //   title: 'Tên',
      //   type: 'string',
      // },
      email: {
        title: 'Email',
        type: 'string',
      },
      // phone: {
      //   title: 'Số điện thoại',
      //   type: 'number',
      // },
      role: {
        title: 'Vai trò',
        type: 'html',
        valuePrepareFunction: (value) => {
          return value == 1 ? 'Quản trị viên' : 'Nhân viên';
        },
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

  constructor(private adminsService: AdminsService,
              private _router: Router,
              private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.retrieveAdmins();
  }

  retrieveAdmins(): void {
    this.adminsService.getAll()
      .subscribe(
        data => {
          this.source = new LocalDataSource(data);
        },
        error => {
          console.log(error);
        });
  }

  onCustomAction(event) {
    if(event.action == 'edit'){
      this._router.navigate(['/pages/admins/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.adminsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrieveAdmins();
              this.toastrService.success(response.message);
            },
            error => {
              this.toastrService.success(error);
            });
      }
    }
  }
}
