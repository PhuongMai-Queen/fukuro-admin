import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminsService } from '../../../../services/admins.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submitted = false;
  error = '';
  login = this.fb.group(
    {
      username: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^\S*$/),
        ]),
      ]});

  constructor(
    private fb: FormBuilder,
    private adminsService: AdminsService,
    private route: ActivatedRoute,
    private _router: Router,
    private toastrService: ToastrService,
    private auth: AuthService) {}

  ngOnInit(): void {}

  get f() {
    return this.login.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    // return validators
    if (this.login.invalid) {
      return false;
    }
    this.adminsService.login(this.login.value).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        const time_to_login = Date.now() + 604800000;
        localStorage.setItem('timer', JSON.stringify(time_to_login));
        localStorage.setItem('id', res.data['id']);
        this.auth.loggedIn();
        this._router.navigate(['/pages/dashboard']);
        this.toastrService.success('Đăng nhập thành công!');
      },
      (error) => {
        this.error = error.error.message;
        this.toastrService.error(this.error);
      }
    );
  }
}
