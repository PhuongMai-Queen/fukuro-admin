/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './views/@core/utils/analytics.service';
import { SeoService } from './views/@core/utils/seo.service';
import { AuthService } from './services/auth.service';
import { Router, NavigationStart, Event, NavigationEnd } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService,
              private seoService: SeoService,
              private toastrService: ToastrService,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
    const timer = localStorage.getItem('timerAdmin');
    if(timer){
      this.auth.loggedIn();
    }
    if (timer && Date.now() > Number(timer)) {
      this.auth.logout();
      this.toastrService.success('Phiên đăng nhập đã hết hạn!');
    }
  }
}
