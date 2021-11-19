import { Component, OnInit } from '@angular/core';
import {Admins} from '../../../../models/admins.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AdminsService} from '../../../../services/admins.service';
import {ToastrService} from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

import './edit-admin.loader';
import 'ckeditor';


@Component({
  selector: 'ngx-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss'],
})
export class EditAdminComponent implements OnInit {
  result = false;
  images = null;
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
  id: null;
  submitted = false;
  uploadForm: FormGroup;
  constructor(private adminsService: AdminsService,
              public fb: FormBuilder,
              private toastrService: ToastrService,
              private http: HttpClient,
              private activatedRoute: ActivatedRoute) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: [''],
    });
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getData(this.id);
  }

  getData(id): void {
    this.adminsService.get(id)
      .subscribe(
        data => {
          this.admins = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updateAdmin(): void {
    // const formData = new FormData();
    // formData.append('file', this.images);
    // if(this.images == null){
    //   const data = {
    //     avatar: this.admins.avatar,
    //     username: this.admins.username,
    //     password: this.admins.password,
    //     email: this.admins.email,
    //     first_name: this.admins.firstName,
    //     last_name: this.admins.lastName,
    //     phone: this.admins.phone,
    //     role: this.admins.role,
    //     status: this.admins.status,
    //   };
    //   this.adminsService.create(data).subscribe(
    //     (response) => {
    //       this.submitted = true;
    //       this.newAdmin();
    //       this.toastrService.success('Thêm mới thành công!');
    //     },
    //     (error) => {
    //       this.toastrService.success('Thêm mới thất bại!');
    //     });
    // }else{
    //   this.http.post(environment.apiPostImg, formData).toPromise().then(res => {
    //     this.admins.avatar = environment.linkImg+res['filename'];
    //     this.result = true;
    //     if(this.result == true){
    //       const data = {
    //         avatar: this.admins.avatar,
    //         username: this.admins.username,
    //         password: this.admins.password,
    //         email: this.admins.email,
    //         first_name: this.admins.firstName,
    //         last_name: this.admins.lastName,
    //         phone: this.admins.phone,
    //         role: this.admins.role,
    //         status: this.admins.status,
    //       };
    //       this.adminsService.create(data).subscribe(
    //         (response) => {
    //           this.submitted = true;
    //           this.newAdmin();
    //           this.toastrService.success('Thêm mới thành công!');
    //         },
    //         (error) => {
    //           this.toastrService.success('Thêm mới thất bại!');
    //         });
    //     }
    //   });
    // }
  }
  showPreview(event) {
    if (event.target.files.length > 0) {
      const file2 = event.target.files[0];
      this.images = file2;
    }
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

  newAdmin(): void {
    this.submitted = false;
    this.images = null;
    this.admins = {
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
  }
}
