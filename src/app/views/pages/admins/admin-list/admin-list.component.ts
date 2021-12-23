import {Component, OnInit} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {ToastrService} from 'ngx-toastr';
import {AdminsService} from '../../../../services/admins.service';
import {Router} from '@angular/router';
import {Admins} from '../../../../models/admins.model';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'ngx-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit {
  limit: 6;
  admins?: Admins[];
  role = 'admin';
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
  settings2 = {
    actions: {
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
    this.limit = 6;
    this.retrieveAdmins();
    const id = localStorage.getItem('id');
    if (id) {
      this.adminsService.get(id)
        .subscribe(
          data => {
            if(data['role'] != "admin"){
              this.role = 'staff';
            }
          });
    }
  }

  retrieveAdmins(): void {
    this.adminsService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.adminsService.getAll(this.limit)
            .subscribe(
              res => {
                for (let item of res['rows']) {
                  if(item.avatar != null){
                    item.avatar = item.avatar;
                  }
                  if(item.avatar == null){
                    item.avatar = 'https://via.placeholder.com/200x200';
                  }
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
      this._router.navigate(['/pages/admins/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.adminsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrieveAdmins();
              // this.toastrService.success(response.message);
              this.toastrService.success('Xóa thành công!');
            },
            error => {
              this.toastrService.error('Không thể xóa!');
            });
      }
    }
  }
}
