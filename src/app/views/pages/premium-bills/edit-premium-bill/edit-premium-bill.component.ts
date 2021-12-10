import {Component, OnInit} from '@angular/core';
import {PremiumBillsService} from '../../../../services/premium-bills.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CustomersService} from '../../../../services/customers.service';
import {PremiumsService} from '../../../../services/premiums.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'ngx-edit-premium-bill',
  templateUrl: './edit-premium-bill.component.html',
  styleUrls: ['./edit-premium-bill.component.scss'],
})
export class EditPremiumBillComponent implements OnInit {
  id: '';
  limit: 6;
  namePremium: any;
  billId: any;
  constructor(private premiumBillsService: PremiumBillsService,
              private _router: Router,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private customersService: CustomersService,
              private premiumsService: PremiumsService,
              public fb: FormBuilder,
  ) {}
  bill = this.fb.group(
    {
      status: [''],
    });

  billCus = this.fb.group(
    {
      name: [''],
      price: [''],
      expire: [''],
      totalPrice: [''],
      paymentStatus: [''],
      customerId: [''],
      premiumId: [''],
    });

  customer = this.fb.group(
    {
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
    });

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getBill(this.id);
  }
  get f() {
    return this.bill.controls;
  }
  getBill(id) {
    this.premiumBillsService.get(id)
      .subscribe(
        data => {
          this.bill = this.fb.group(
            {
              status: [data.status],
            });
          this.billId = data.id;
          this.billCus = this.fb.group(
            {
              name: [data.name],
              price: [data.price],
              expire: [data.expire],
              totalPrice: [data.totalPrice],
              paymentStatus: [data.paymentStatus],
              customerId: [data.customerId],
              premiumId: [data.premiumId],
            });
          this.getCustomer(data.customerId);
          this.getPremium(data.premiumId);
        },
        error => {
          console.log(error);
        });
  }
  getPremium(id) {
    this.premiumsService.get(id)
      .subscribe(
        data => {
          this.namePremium = data.name;
        },
        error => {
          console.log(error);
        });
  }
  getCustomer(id) {
    this.customersService.get(id)
      .subscribe(data => {
          this.customer = this.fb.group(
            {
              firstName: [data.firstName],
              lastName: [data.lastName],
              email: [data.email],
              phone: [data.phone],
            });
        // this.customer = data;
      },
      error => {
      console.log(error);
    });
  }
  update() {
    this.premiumBillsService.update(this.billId, this.bill.value)
      .subscribe(
        response => {
          this.toastrService.success(response.message);
        },
        error => {
          console.log(error);
        });
  }
}
