import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminsService} from '../../../../services/admins.service';
import {ToastrService} from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MustMatch } from '../../../../services/validators/must-match.validator';
import './create-admin.loader';
import 'ckeditor';

@Component({
  selector: 'ngx-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss'],
})
export class CreateAdminComponent implements OnInit {
  result = false;
  images = null;
  submitted = false;
  admins: FormGroup;
  error = '';
  constructor(private adminsService: AdminsService,
              public fb: FormBuilder,
              private toastrService: ToastrService,
              private http: HttpClient) {
    // Reactive Form
    this.admins = this.fb.group({
      avatar: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^\S*$/)])],
      cpassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^\S*$/)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9 ]{10}')])],
      role: ['1', Validators.compose([Validators.required])],
      status: ['1'],
    },
    {
      validator: MustMatch('password', 'cpassword'),
    },
    );
  }
  ngOnInit(): void {}

  get f() {
    return this.admins.controls;
  }
  // Image Preview
  showPreview(event) {
    if (event.target.files.length > 0) {
      const file2 = event.target.files[0];
      this.images = file2;
    }
    const file = (event.target as HTMLInputElement).files[0];
    this.admins.patchValue({
      avatar: file,
    });
    this.admins.get('avatar').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.admins.patchValue({
        avatar: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  //Save Admin
  saveAdmin(): any {
    const formData = new FormData();
    formData.append('file', this.images);
    this.submitted = true;

    // return validators
    if (this.admins.invalid) {
      return false;
    }
    this.http.post(environment.apiPostImg, formData).toPromise().then(res => {
        this.result = true;
        if(this.result == true){
          const data = {
            avatar: environment.linkImg+res['filename'],
            username: this.admins.value['username'],
            password: this.admins.value['password'],
            email: this.admins.value['email'],
            first_name: this.admins.value['firstName'],
            last_name: this.admins.value['lastName'],
            phone: this.admins.value['phone'],
            role: this.admins.value['role'],
            status: this.admins.value['status'],
          };
          this.adminsService.create(data).subscribe(
            (response) => {
              this.submitted = true;
              this.newAdmin();
              this.toastrService.success('Thêm mới thành công!');
            },
            (error) => {
              this.toastrService.success('Thêm mới thất bại!');
            });
        }
      });
  }

  //Reset form
  newAdmin(): void {
    this.submitted = false;
    this.images = null;
    this.admins = this.fb.group({
      avatar: [''],
      username: [''],
      password: [null],
      email: [''],
      firstName: [''],
      lastName: [''],
      phone: [''],
      role: [''],
      status: [1],
    });
  }
}
