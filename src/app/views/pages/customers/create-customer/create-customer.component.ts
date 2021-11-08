import { Component, OnInit } from '@angular/core';
import {Customers} from '../../../../models/customers.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomersService} from '../../../../services/customers.service';

@Component({
  selector: 'ngx-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit {
  customers: Customers = {
    avatar: '',
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    status: '',
  };
  submitted = false;
  uploadForm: FormGroup;
  constructor(private customersService: CustomersService, public fb: FormBuilder) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: [''],
    });
  }
  ngOnInit(): void {}
  saveCustomer(): void {
    const data = {
      avatar: this.customers.avatar,
      username: this.customers.username,
      password: this.customers.password,
      email: this.customers.email,
      first_name: this.customers.first_name,
      last_name: this.customers.last_name,
      phone: this.customers.phone,
      status: this.customers.status,
    };
    // console.log(data);
    // this.blogsService.create(data).subscribe(
    //   (response) => {
    //     console.log(response);
    //     this.submitted = true;
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
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
      this.customers.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
