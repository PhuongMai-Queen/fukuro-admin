import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AdminsService} from '../../../../services/admins.service';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MustMatch} from '../../../../services/validators/must-match.validator';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
  id: '';
  error = '';
  submitted = false;
  constructor(private adminsService: AdminsService, public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService)  {}
  changePass = this.fb.group(
    {
      old_password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      cf_password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    },
    {
      validator: MustMatch('password', 'cf_password'),
    });
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
  }
  get f() {
    return this.changePass.controls;
  }
  updateChangePass(): any {
    this.submitted = true;

    // return validators
    if (this.changePass.invalid) {
      return false;
    }
    const data = {password: this.changePass.value['password']};
    this.adminsService.update(this.id, data).subscribe(
      (response) => {
        this.newForm();
        this.toastrService.success(response.message);
      },
      (error) => {
        this.toastrService.error(error);
      });
  }
  //Reset form
  newForm(): void {
    this.submitted = false;
    this.changePass = this.fb.group({
      old_password: [''],
      password: [''],
      cf_password: [''],
    });
  }
}
