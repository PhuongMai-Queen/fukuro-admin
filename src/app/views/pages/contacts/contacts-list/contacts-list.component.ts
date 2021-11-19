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
    this.contactsService.getAll()
      .subscribe(
        data => {
          this.source = new LocalDataSource(data);
        },
        error => {
          console.log(error);
        });
  }
  onCustomAction(event) {
    if(event.action == 'info'){
      this._router.navigate(['pages/contacts/info/'+event.data['id']]);
    }
    if(event.action == 'edit'){
      this._router.navigate(['pages/contacts/edit/'+event.data['id']]);
    }
    if(event.action == 'delete'){
      if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
        this.contactsService.delete(event.data['id'])
          .subscribe(
            response => {
              this.retrieveContacts();
              this.toastrService.success(response.message);
            },
            error => {
              this.toastrService.success(error);
            });
      }
    }
  }
}
