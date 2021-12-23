import {Component, OnInit} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {ContactsService} from '../../../../services/contacts.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss'],
})
export class ContactsListComponent implements OnInit {
  limit: 6;
  settings = {
    actions: {
      custom: [
        {
          name: 'info',
          title: '<i class="nb-edit text-success" title="Xem chi tiết"></i>'
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
      firstName: {
        title: 'Tên',
        type: 'number',
      },
      phone: {
        title: 'Số điện thoại',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      subject: {
        title: 'Chủ đề',
        type: 'string',
      },
      status: {
        title: 'Trạng thái',
        type: 'html',
        valuePrepareFunction: (value: any) => {
          if(value == 0){
            return 'Chưa gửi phản hồi';
          }else{
            return 'Đã gửi phản hồi';
          }
        },
      },
    },
  };

  source: LocalDataSource;

  constructor(private contactsService: ContactsService,
              private _router: Router,
              private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.retrieveContacts();
  }
  retrieveContacts(): void {
    this.contactsService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.contactsService.getAll(this.limit)
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
    if(event.action == 'info'){
      this._router.navigate(['pages/contacts/info/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.contactsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrieveContacts();
              this.toastrService.success('Xóa thành công!');
            },
            error => {
              this.toastrService.error('Không thể xóa!');
            });
      }
    }
  }
}
