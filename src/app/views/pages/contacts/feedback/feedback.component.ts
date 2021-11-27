import { Component, OnInit } from '@angular/core';
import { AdminsService } from '../../../../services/admins.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {ContactsService} from '../../../../services/contacts.service';

import './feedback.loader';
import 'ckeditor';


@Component({
  selector: 'ngx-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  id = '';
  email = '';
  submitted = false;
  error = '';
  constructor(private adminsService: AdminsService,
              public fb: FormBuilder,
              private http: HttpClient,
              private toastrService: ToastrService,
              private _router: Router,
              private activatedRoute: ActivatedRoute,
              private contactsService: ContactsService,
  ) {}
  feedback = this.fb.group(
    {
      subject: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
    });
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getContactDetail(this.id);
  }
  get f() {
    return this.feedback.controls;
  }

  getContactDetail(id): void {
    this.contactsService.get(id)
      .subscribe(
        data => {
          this.feedback.patchValue({email: data.email});
        },
        error => {
          console.log(error);
        });
  }
  // Create blog
  sendFeedback(): any {
    this.submitted = true;
    // return validators
    if (this.feedback.invalid) {
      return false;
    }
    this.adminsService.requestContact(this.feedback.value).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        if(error.error.text == "Success"){
          this.newFeedback();
          this.toastrService.success('Gửi phản hồi thành công!!');
        }
        else {
          this.toastrService.error(error.error.text);
        }
      });
  }

  newFeedback(): void {
    this.submitted = false;
    this.feedback = this.fb.group({
      subject: [''],
      message: [''],
    });
  }

}
