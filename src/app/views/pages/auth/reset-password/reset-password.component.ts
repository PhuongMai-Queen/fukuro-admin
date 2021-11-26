import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminsService} from '../../../../services/admins.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MustMatch} from '../../../../services/validators/must-match.validator';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  id = '';
  error = '';
  resetPass: FormGroup;
  submitted = false;
  email = '';
  token = '';
  constructor(private adminsService: AdminsService, public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService,
              private _router: Router)  {
    this.resetPass = this.fb.group(
      {
        new_password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        cf_password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      },
      {
        validator: MustMatch('new_password', 'cf_password'),
      });
  }

  ngOnInit(): void {
    this.id = localStorage.getItem('id');
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    });
  }
  get f() {
    return this.resetPass.controls;
  }
  resetPassword(): any {
    this.submitted = true;
    // return validators
    if (this.resetPass.invalid) {
      return false;
    };
    const data = {
      email: this.email,
      token: this.token,
      password: this.resetPass.value['new_password']
    };
      this.adminsService.resetPassword(data).subscribe(
      (response) => {
        this._router.navigate(['/auth/login']);
        this.toastrService.success(response.message);
      },
      (error) => {
        const mess = error.error.text;
        this.toastrService.error(mess);
      });
  }
}
