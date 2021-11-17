import { Component, OnInit } from '@angular/core';
import {Admins} from '../../../../models/admins.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AdminsService} from '../../../../services/admins.service';

import './create-admin.loader';
import 'ckeditor';

@Component({
  selector: 'ngx-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss'],
})
export class CreateAdminComponent implements OnInit {
  admins: Admins = {
    avatar: '',
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: '',
    status: '',
  };
  submitted = false;
  uploadForm: FormGroup;
  constructor(private adminsService: AdminsService, public fb: FormBuilder) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: [''],
    });
  }
  ngOnInit(): void {}

  saveAdmin(): void {
    const data = {
      avatar: this.admins.avatar,
      username: this.admins.username,
      password: this.admins.password,
      email: this.admins.email,
      first_name: this.admins.firstName,
      last_name: this.admins.lastName,
      phone: this.admins.phone,
      role: this.admins.role,
      status: this.admins.status,
    };
    // console.log(data);
  }
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      avatar: file,
    });
    this.uploadForm.get('avatar').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.admins.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
