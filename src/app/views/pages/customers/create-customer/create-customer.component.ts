import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../../../services/customers.service';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {MustMatch} from '../../../../services/validators/must-match.validator';

@Component({
  selector: 'ngx-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit {
  result = false;
  images = null;
  submitted = false;
  customers: FormGroup;
  error = '';
  constructor(private customersService: CustomersService,
              public fb: FormBuilder,
              private toastrService: ToastrService,
              private http: HttpClient) {
    // Reactive Form
    this.customers = this.fb.group({
      avatar: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^\S*$/)])],
      cpassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^\S*$/)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9 ]{10}')])],
      status: ['1'],
    },
      {
        validator: MustMatch('password', 'cpassword')})
  }
  ngOnInit(): void {}

  get f() {
    return this.customers.controls;
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

  //Save Customer
  saveCustomer(): any {
    const formData = new FormData();
    formData.append('file', this.images);
    this.submitted = true;

    // return validators
    if (this.customers.invalid) {
      return false;
    }
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
          role: this.customers.value['role'],
          status: this.customers.value['status'],
        };
        this.customersService.create(data).subscribe(
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
    this.customers = this.fb.group({
      avatar: [''],
      username: [''],
      password: [''],
      cpassword: [''],
      email: [''],
      firstName: [''],
      lastName: [''],
      phone: [''],
      status: [1],
    });
  }
}
