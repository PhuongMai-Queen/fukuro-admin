import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AdminsService} from '../../../../services/admins.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'ngx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  submitted = false;
  error = '';
  done = false;
  forgotPassword = this.fb.group(
    {
      username: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      email: [
        '',
        Validators.compose([Validators.required, Validators.email]),
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
    return this.forgotPassword.controls;
  }
  onSubmit(): any {
    this.submitted = true;
    // return validators
    if (this.forgotPassword.invalid) {
      return false;
    }
    this.adminsService.forgotPassword(this.forgotPassword.value).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        if(error.error.text == "Success"){
          this.done = true;
          this.toastrService.success('Gửi yêu cầu thành công! Vui lòng kiểm tra email!!');
        }
        else {
          this.done = false;
          this.toastrService.error('Tên người dùng hoặc email không đúng!');
        }
      });
  }
}
