import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
    },
    {validator: this.checkDates});
  ngOnInit(): void {}
  checkDates(group: FormGroup) {
    if(group.controls.endDate.value < group.controls.startDate.value) {
      return { notValid: true }
    }
    return null;
  }
  get f() {
    return this.promotion.controls;
  }
  savePromotion(): any {
    this.submitted = true;

    // return validators
    if (this.promotion.invalid) {
      return false;
    }
    const data = {
      name: this.promotion.value['name'],
      discount: this.promotion.value['discount'],
      start_date: this.promotion.value['startDate'],
      end_date: this.promotion.value['endDate'],
      status: this.promotion.value['status'],
    }
    this.promotionsService.create(data).subscribe(
      (response) => {
        this.newPromotion();
        this.toastrService.success('Thêm mới thành công!');
      },
      (error) => {
        this.toastrService.success(error);
      });
  }
  newPromotion(): void {
    this.submitted = false;
    this.promotion = this.fb.group(
      {
        name: [''],
        discount: [''],
        startDate: [''],
        endDate: [''],
        status: ['1']});
  }
}
