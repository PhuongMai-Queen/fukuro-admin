import { Component, OnInit } from '@angular/core';
import {Admins} from '../../../../models/admins.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../../../services/customers.service';
import {ToastrService} from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {MustMatch} from '../../../../services/validators/must-match.validator';

import './edit-customer.loader';
import 'ckeditor';

@Component({
  selector: 'ngx-edit-admin',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss'],
})
export class EditCustomerComponent implements OnInit {
  id = '';
  result = false;
  images = null;
  submitted = false;
  error = '';
  constructor(private customersService: CustomersService,
              public fb: FormBuilder,
              private toastrService: ToastrService,
              private http: HttpClient,
              private activatedRoute: ActivatedRoute) {}

  customers = this.fb.group({
    avatar: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    username: ['', Validators.compose([Validators.required])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    firstName: ['', Validators.compose([Validators.required])],
    lastName: ['', Validators.compose([Validators.required])],
    phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9 ]{10}')])],
    status: [1],
    });

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getData(this.id);
  }

  get f() {
    return this.customers.controls;
  }

  getData(id): void {
    this.customersService.get(id)
      .subscribe(
        data => {
          this.customers = this.fb.group({
            avatar: [data.avatar, Validators.compose([Validators.required, Validators.minLength(6)])],
            username: [data.username, Validators.compose([Validators.required])],
            email: [data.email, Validators.compose([Validators.required, Validators.email])],
            firstName: [data.firstName, Validators.compose([Validators.required])],
            lastName: [data.lastName, Validators.compose([Validators.required])],
            phone: [data.phone, Validators.compose([Validators.required, Validators.pattern('[0-9 ]{10}')])],
            status: [data.status],
          });
        },
        error => {
          console.log(error);
        });
  }

  // Image Preview
  showPreview(event) {
    if (event.target.files.length > 0) {
      const file2 = event.target.files[0];
      this.images = file2;
    }
    const file = (event.target as HTMLInputElement).files[0];
    this.customers.patchValue({
      avatar: file,
    });
    this.customers.get('avatar').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.customers.patchValue({
        avatar: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }
  //  Update admin
  updateCustomer(): any {
    const formData = new FormData();
    formData.append('file', this.images);
    this.submitted = true;
    if (this.customers.invalid) {
      return false;
    }
    if(this.images == null){
      const data = {
        avatar: this.customers.value['avatar'],
        username: this.customers.value['username'],
        password: this.customers.value['password'],
        email: this.customers.value['email'],
        first_name: this.customers.value['firstName'],
        last_name: this.customers.value['lastName'],
        phone: this.customers.value['phone'],
        status: this.customers.value['status'],
      };

      this.customersService.update(this.id, data).subscribe(
        (response) => {
          console.log(response);
          this.submitted = true;
          this.toastrService.success(response.message);
        },
        (error) => {
          this.toastrService.success(error.message);
        });
    }else{
      this.http.post(environment.apiPostImg, formData).toPromise().then(res => {
        this.result = true;
        if(this.result == true){
          const data = {
            avatar: environment.linkImg+res['filename'],
            username: this.customers.value['username'],
            password: this.customers.value['password'],
            email: this.customers.value['email'],
            first_name: this.customers.value['firstName'],
            last_name: this.customers.value['lastName'],
            phone: this.customers.value['phone'],
            status: this.customers.value['status'],
          };
          this.customersService.update(this.id, data).subscribe(
            (response) => {
              this.submitted = true;
              this.toastrService.success(response.message);
            },
            (error) => {
              this.toastrService.success(error.message);
            });
        }
      });
    }
  }
}
