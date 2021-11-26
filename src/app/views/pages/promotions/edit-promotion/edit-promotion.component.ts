import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PromotionsService} from '../../../../services/promotions.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-edit-promotion',
  templateUrl: './edit-promotion.component.html',
})
export class EditPromotionComponent implements OnInit {
  id: '';
  error = '';
  submitted = false;
  constructor(private promotionsService: PromotionsService, public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService,
              public datepipe: DatePipe)  {}
  promotion = this.fb.group(
    {
      name: [''],
      discount: [''],
      startDate: [''],
      endDate: [''],
      status: ['1'],
    }, {validator: this.checkDates});
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getPromotion(this.id);
  }
  checkDates(group: FormGroup) {
    if(group.controls.endDate.value < group.controls.startDate.value) {
      return { notValid: true }
    }
    return null;
  }
  get f() {
    return this.promotion.controls;
  }
  getPromotion(id): void {
    this.promotionsService.get(id).subscribe(
        data => {
          this.promotion = this.fb.group(
            {
              name: [data.name,  Validators.compose([Validators.required])],
              discount: [data.discount,  Validators.compose([Validators.required])],
              startDate: [this.datepipe.transform(data.startDate, 'yyyy-MM-dd')],
              endDate: [this.datepipe.transform(data.endDate, 'yyyy-MM-dd')],
              status: [data.status]});
        },
        error => {
          console.log(error);
        });
  }
  updatePromotion(): any {
    this.submitted = true;

    // return validators
    if (this.promotion.invalid) {
      return false;
    }
    this.promotionsService.update(this.id, this.promotion.value).subscribe(
      (response) => {
        this.toastrService.success(response.message);
      },
      (error) => {
        this.toastrService.success(error);
      });
  }
}
