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
  contactDetail: any;
  constructor(private contactsService: ContactsService, public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService)  {}
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getContactDetail(this.id);
  }

  getContactDetail(id): void {
    this.contactsService.get(id)
      .subscribe(
        data => {
          this.contactDetail = data;
        },
        error => {
          console.log(error);
        });
  }
}
