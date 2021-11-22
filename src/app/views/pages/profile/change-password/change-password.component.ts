import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AdminsService} from '../../../../services/admins.service';
import {HttpClient} from '@angular/common/http';
import {MustMatch} from '../../../../services/validators/must-match.validator';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  result = false;
  submitted = false;
  error = '';
  constructor(private adminsService: AdminsService,
              public fb: FormBuilder,
              private toastrService: ToastrService,
              private http: HttpClient) {}

  changePass = this.fb.group({
      old_password: ['', Validators.compose([Validators.required])],
      new_password: [''],
      cf_password: [''],
    },
    {
      validator: MustMatch('new_password', 'cf_password'),
    },
  );

  ngOnInit(): void {}

  get f() {
    return this.changePass.controls;
  }
  resetPassword(): any {
    if (this.changePass.invalid) {
      return false;
    }
    const data = {password: this.changePass.value['new_password']};

    // this.adminsService.create(data).subscribe(
    //   (response) => {
    //     this.newResetPassword();
    //     this.toastrService.success(response.message);
    //   },
    //   (error) => {
    //     this.toastrService.success(error.message);
    //   });
  }
  newResetPassword(): any {
    this.submitted = false;
    this.changePass = this.fb.group(
      {
        old_password: [''],
        new_password: [''],
        cf_password: [''],
      });
  }
}
