import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PremiumsService} from '../../../../services/premiums.service';
import {PromotionsService} from '../../../../services/promotions.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Promotions} from '../../../../models/promotions.model';

@Component({
  selector: 'ngx-create-premiums',
  templateUrl: './create-premiums.component.html',
})
export class CreatePremiumsComponent implements OnInit {
  id: '';
  error = '';
  submitted = false;
  promotions?: Promotions[];
  premiums: FormGroup;
  limit: 6;
  constructor(private premiumsService: PremiumsService, public fb: FormBuilder,
              private promotionsService: PromotionsService,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService)  {
    this.premiums = this.fb.group(
      {
        name: ['', Validators.compose([Validators.required])],
        price: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
        description: ['', Validators.compose([Validators.required])],
        promotionId: ['', Validators.compose([Validators.required])],
        status: ['1'],
      });
  }

  ngOnInit(): void {
    this.retrievePromotions();
  }
  get f() {
    return this.premiums.controls;
  }
  retrievePromotions(): void {
    this.promotionsService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.promotionsService.getAll(this.limit)
            .subscribe(
              res => {
                this.promotions = res['rows'];
              });
        },
        error => {
          console.log(error);
        });
  }
  savePremium(): any {
    this.submitted = true;

    // return validators
    if (this.premiums.invalid) {
      return false;
    }
    const data = {
      name: this.premiums.value['name'],
      price: this.premiums.value['price'],
      description: this.premiums.value['description'],
      promotion_id: this.premiums.value['promotionId'],
      status: this.premiums.value['status'],
    }
    this.premiumsService.create(data).subscribe(
      (response) => {
        this.newPremium();
        this.toastrService.success('Thêm mới thành công!');
      },
      (error) => {
        this.toastrService.success(error);
      });
  }
  newPremium(): void {
    this.submitted = false;
    this.premiums = this.fb.group(
      {
        name: [''],
        price: [''],
        description: [''],
        promotionId: [''],
        status: ['1']});
  }
}
