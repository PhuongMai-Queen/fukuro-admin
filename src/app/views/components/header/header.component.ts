import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { UserData } from '../../@core/data/users';
import { LayoutService } from '../../@core/utils';
import { Subscription , Subject } from 'rxjs';
import { AdminsService } from '../../../services/admins.service';
import { AuthService } from '../../../services/auth.service';
import {environment} from '../../../../environments/environment';

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
  ) {
  }
  userMenu = [
    { icon: 'person-outline', title: 'Hồ sơ', link: '/pages/profile/update-profile/'+localStorage.getItem('id') },
    { icon: 'unlock-outline', title: 'Đổi mật khẩu', link: '/pages/profile/change-password/'+localStorage.getItem('id') },
    { icon: 'power-outline', title: 'Đăng xuất'} ];
  onContecxtItemSelection(title) {
    if(title == 'Đăng xuất'){
      this.auth.logout();
    }
  }
  ngOnInit() {
    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });

    this.currentTheme = this.themeService.currentTheme;
    const id = localStorage.getItem('id');
    if(id){
      this.getById(id);
    }
    this.adminsService.profileImageUpdate$.subscribe((profileImage) => this.avatar = profileImage);
    this.adminsService.profileName$.subscribe((profileName) => this.name = profileName);
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
