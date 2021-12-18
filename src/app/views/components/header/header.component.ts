import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { UserData } from '../../@core/data/users';
import { LayoutService } from '../../@core/utils';
import { Subscription , Subject } from 'rxjs';
import { AdminsService } from '../../../services/admins.service';
import { AuthService } from '../../../services/auth.service';
import {environment} from '../../../../environments/environment';
import { AdminNotificationsService } from '../../../services/admin-notifications.service';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public subscription: Subscription;
  userPictureOnly: boolean = false;
  profile: any;
  name: any;
  avatar: any;
  limit = 6;
  status = 0;
  countNewNotification: any;
  notification: any;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];
  currentTheme = 'default';

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private adminsService: AdminsService,
              public auth: AuthService,
              private adminNotificationsService: AdminNotificationsService,
              private _router: Router,
  ) {
    this.notification = [
      {id: -1, icon: '', title: 'Chưa có thông báo mới!', status: 0, path: ''},
      {id: 0, icon: 'bell-outline', title: 'Xem tất cả thông báo', status: 0, path: '/pages/notifications/list'},
    ];
  }
  userMenu = [
    { icon: 'person-outline', title: 'Hồ sơ', link: '/pages/profile/update-profile/'+ localStorage.getItem('id') },
    { icon: 'unlock-outline', title: 'Đổi mật khẩu', link: '/pages/profile/change-password/'+ localStorage.getItem('id') },
    { icon: 'power-outline', title: 'Đăng xuất'} ];


  ngOnInit() {
    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
        this.adminNotifications(event.item);
      });

    this.currentTheme = this.themeService.currentTheme;
    const id = localStorage.getItem('id');
    if(id){
      this.getById(id);
    }
    this.adminsService.profileImageUpdate$.subscribe((profileImage) => this.avatar = profileImage);
    this.adminsService.profileName$.subscribe((profileName) => this.name = profileName);
    this.adminsService.notifications$.subscribe((notifications) => this.countNewNotification = notifications);
    this.adminsService.listNotifications$.subscribe((listNotifications) => {
      this.notification = JSON.parse(listNotifications);
    });
    this.getNotification();
  }

  onContecxtItemSelection(title) {
    if(title == 'Đăng xuất'){
      this.auth.logout();
    }
  }

  adminNotifications(item) {
    if (item.id == 0) {
      this._router.navigate([item.path]);
    }
    const data = {status: 1};
    if (item.id >= 1) {
      this.adminNotificationsService.update(item.id, data).subscribe(
        (response) => {
          this.getNotification();
          this._router.navigate([item.path]);
        });
    }
  }

  getNotification() {
    this.adminNotificationsService.getAll(this.limit, this.status)
      .subscribe(
        data => {
          this.notification = [];
          if ( data['count'] > 0) {
            for (let item of data['rows']) {
              this.notification.push(
                {
                  id: item.id,
                  icon: 'person-outline',
                  title: item.message,
                  status: item.status,
                  path: item.detailUrl,
                });
            }
            this.notification.push( {id: 0, icon: 'bell-outline', title: 'Xem tất cả thông báo', status: 0, path: '/pages/notifications/list'});
          } else {
            this.notification.push(
              {id: -1, icon: '', title: 'Chưa có thông báo mới!', status: 0, path: ''},
              {id: 0, icon: 'bell-outline', title: 'Xem tất cả thông báo', status: 0, path: '/pages/notifications/list'},
              );
          }
          this.adminNotificationsService.getAll(data['count'], this.status)
            .subscribe(
              res => {
                this.adminsService.notifications$.next(res['count']);
                this.countNewNotification = res['count'];
              });
        });
  }

  getById(id: string): void {
    this.adminsService.get(id)
      .subscribe(
        data => {
          this.avatar = environment.linkImg+data['avatar'];
          this.name = data['firstName']+' '+data['lastName'];
        });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

}
