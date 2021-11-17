import { Component } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  template: `<ngx-two-columns-layout>
    <router-outlet></router-outlet>
  </ngx-two-columns-layout>`,
})
export class AuthComponent {

}
