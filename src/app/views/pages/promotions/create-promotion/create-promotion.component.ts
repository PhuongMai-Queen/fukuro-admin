import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {PromotionsService} from '../../../../services/promotions.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-create-promotion',
  templateUrl: './create-promotion.component.html',
})
export class CreatePromotionComponent implements OnInit {
  id: '';
  error = '';
  submitted = false;
  constructor(private promotionsService: PromotionsService, public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService)  {}
  promotion = this.fb.group(
    {
      name: ['', Validators.compose([Validators.required])],
      discount: ['', Validators.compose([Validators.required])],
      startDate: ['', Validators.compose([Validators.required])],
      endDate: ['', Validators.compose([Validators.required])],
      status: ['1'],
    });
  ngOnInit(): void {}
  get f() {
    return this.promotion.controls;
  }
  savePromotion(): any {
    this.submitted = true;

    // return validators
    if (this.promotion.invalid) {
      return false;
    }
  }
}
