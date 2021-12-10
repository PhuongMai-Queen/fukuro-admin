import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ContactsService} from '../../../../services/contacts.service';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit {
  id: '';
  error = '';
  constructor(private contactsService: ContactsService, public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService)  {}

  contactDetail = this.fb.group(
    {
      id: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      subject: [''],
      message: [''],
      status: [''],
      adminId: [''],
    });
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getContactDetail(this.id);
  }
  getContactDetail(id): void {
    this.contactsService.get(id)
      .subscribe(
        data => {
          this.contactDetail = this.fb.group(
            {
              id: [data.id],
              firstName: [data.firstName],
              lastName: [data.lastName],
              email: [data.email],
              phone: [data.phone],
              subject: [data.subject],
              message: [data.message],
              status: [data.status],
              adminId: [data.adminId],
            });
        },
        error => {
          console.log(error);
        });
  }
}
