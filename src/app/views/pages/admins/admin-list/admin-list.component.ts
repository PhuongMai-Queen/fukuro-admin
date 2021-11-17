import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import {AdminsService} from '../../../../services/admins.service';
import {Router} from '@angular/router';
import {Admins} from "../../../../models/admins.model";

@Component({
  selector: 'ngx-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent {
  admins?: Admins[];
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
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
      lastName: {
        title: 'Họ',
        type: 'string',
      },
      firstName: {
        title: 'Tên',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      phone: {
        title: 'Số điện thoại',
        type: 'number',
      },
    },
  };

  source: LocalDataSource;

  constructor(private adminsService: AdminsService, private _router: Router) {}

  ngOnInit(): void {
    this.retrieveAdmins();
  }

  retrieveAdmins(): void {
    this.adminsService.getAll()
      .subscribe(
        data => {
          this.source = new LocalDataSource(data);
          // console.log(data);
        },
        error => {
          // console.log(error);
        });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
