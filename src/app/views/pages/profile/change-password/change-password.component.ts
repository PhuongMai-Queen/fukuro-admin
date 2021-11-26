import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminsService} from '../../../../services/admins.service';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MustMatch} from '../../../../services/validators/must-match.validator';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
  id = '';
  error = '';
  changePass: FormGroup;
  submitted = false;
  constructor(private adminsService: AdminsService, public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService)  {
    this.changePass = this.fb.group(
      {
        old_password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        new_password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        cf_password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      },
      {
        validator: MustMatch('new_password', 'cf_password'),
      });
  }
  ngOnInit(): void {
    this.id = localStorage.getItem('id');
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
    const data = {
      id: this.id,
      old_password: this.changePass.value['old_password'],
      new_password: this.changePass.value['new_password']};
    this.adminsService.changePassword(data).subscribe(
      (response) => {
        this.newForm();
        this.toastrService.success(response.message);
      },
      (error) => {
        const mess = error.error.text;
        this.toastrService.error(mess);
      });
  }
  // Reset form
  newForm(): void {
    this.submitted = false;
    this.changePass = this.fb.group({
      old_password: [''],
      new_password: [''],
      cf_password: [''],
    });
  }
}
