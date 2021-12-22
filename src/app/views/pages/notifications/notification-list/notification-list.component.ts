import {Component, OnInit} from '@angular/core';
import {AdminNotificationsService} from '../../../../services/admin-notifications.service';
import {Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {AdminsService} from "../../../../services/admins.service";
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ngx-notification-list',
  templateUrl: 'notification-list.component.html',
  styleUrls: ['notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit {
  limit = 6;
  status = 'both';
  notifications: any;
  checkLink = 'hoi-dap';
  linkClient = environment.linkClient;
  constructor(
              private adminNotificationsService: AdminNotificationsService,
              private _router: Router,
              private toastrService: ToastrService,
              private adminsService: AdminsService,
  ) {
  }
  ngOnInit() {
    this.notifications = [];
    this.getNotification();
  }
  getNotification() {
    this.adminNotificationsService.getAll(this.limit, this.status)
      .subscribe(
        data => {
          this.adminNotificationsService.getAll(data['count'], this.status)
            .subscribe(
              (res: any) => {
                this.notifications = [];
                for (let item of res['rows']) {
                  if(item.status == 0){
                    this.notifications.push({id: item.id, message: item.message, detailUrl: item.detailUrl, status: item.status, statusCus: 'Chưa xem'});
                  }else{
                    this.notifications.push({id: item.id, message: item.message, detailUrl: item.detailUrl, status: item.status, statusCus: 'Đã xem'});
                  }
                }
              });
        });
  }
  updateCount() {
    const status = 0;
    this.adminNotificationsService.getAll(this.limit, status)
      .subscribe(
        data => {
          this.adminNotificationsService.getAll(data['count'], status)
            .subscribe(
              (res: any) => {
                this.adminsService.notifications$.next(res['count']);
                const arr = [];
                if ( data['count'] > 0) {
                  for (let item of data['rows']) {
                    arr.push(
                      {
                        id: item.id,
                        icon: 'person-outline',
                        title: item.message,
                        status: item.status,
                        path: item.detailUrl,
                      });
                  }
                  arr.push( {id: 0, icon: 'bell-outline', title: 'Xem tất cả thông báo', status: 0, path: '/pages/notifications/list'});
                } else {
                  arr.push(
                    {id: -1, icon: '', title: 'Chưa có thông báo mới!', status: 0, path: ''},
                    {id: 0, icon: 'bell-outline', title: 'Xem tất cả thông báo', status: 0, path: '/pages/notifications/list'},
                  );
                }
                this.adminsService.listNotifications$.next(JSON.stringify(arr));
              });
        });
  }
  adminNotifications(item) {
    const data = {status: 1};
    // console.log(item.detailUrl);
    // console.log(this.checkLink);
    if(item.status == 0){
      this.adminNotificationsService.update(item.id, data).subscribe(
        (response) => {
          this.updateCount();
          if(item.detailUrl.includes(this.checkLink)){
            window.location.href = this.linkClient + item.detailUrl;
          }else{
            this._router.navigate([item.detailUrl]);
          }
          this.getNotification();
        });
    }else{
      if(item.detailUrl.includes(this.checkLink)){
        window.location.href = this.linkClient + item.detailUrl;
      }else{
        this._router.navigate([item.detailUrl]);
      }
    }
  }
  delete(id) {
    if (window.confirm('Bạn có chắn chắn sẽ xoá không?')) {
      this.adminNotificationsService.delete(id)
        .subscribe(
          response => {
            this.updateCount();
            this.getNotification();
            this.toastrService.success(response.message);
          },
          error => {
            this.toastrService.success(error.message);
          });
    }
  }
  deleteAll() {
    if (window.confirm('Bạn có chắn chắn sẽ xoá tất cả không?')) {
      this.adminNotificationsService.deleteAll()
        .subscribe(
          response => {
            this.updateCount();
            this.getNotification();
            this.toastrService.success(response.message);
          },
          error => {
            this.toastrService.success(error.message);
          });
    }
  }
}
