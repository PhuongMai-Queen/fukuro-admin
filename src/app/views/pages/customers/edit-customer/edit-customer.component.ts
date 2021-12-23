import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../../../services/customers.service';
import {ToastrService} from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

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
    avatar: [''],
    username: ['', Validators.compose([Validators.required])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    firstName: [''],
    lastName: [''],
    phone: ['', Validators.compose([Validators.pattern('[0-9 ]{10}')])],
    status: [1],
    avatarCus: [''],
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
            avatar: [environment.linkImg+data.avatar],
            username: [data.username, Validators.compose([Validators.required])],
            email: [data.email, Validators.compose([Validators.required, Validators.email])],
            firstName: [data.firstName],
            lastName: [data.lastName],
            phone: [data.phone, Validators.compose([Validators.pattern('[0-9 ]{10}')])],
            status: [data.status],
            avatarCus: [data.avatar],
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
        avatar: this.customers.value['avatarCus'],
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
          this.toastrService.error(error.message);
        });
    }else{
      this.customersService.get(this.id).toPromise().then(
        data => {
          const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: {
              file_name: data.avatar,
            },
          };
          this.http.delete(environment.apiDeleteImg, options).subscribe();
        });
      this.http.post(environment.apiPostImg, formData).toPromise().then(res => {
        this.result = true;
        if(this.result == true){
          const data = {
            avatar: res['filename'],
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
              this.toastrService.error(error.message);
            });
        }
      });
    }
  }
}
