import { Component, OnInit } from '@angular/core';
import {Promotions} from '../../../../models/promotions.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PromotionsService} from '../../../../services/promotions.service';

@Component({
  selector: 'ngx-create-promotion',
  templateUrl: './create-promotion.component.html',
})
export class CreatePromotionComponent implements OnInit {
  promotions: Promotions = {
    name: '',
    discount: '',
    startDate: '',
    endDate: '',
    status: '',
  };
  submitted = false;
  constructor(private promotionsService: PromotionsService, public fb: FormBuilder) {}
  ngOnInit(): void {}
  savePromotion(): void {
    const data = {
      name: this.promotions.name,
      discount: this.promotions.discount,
      start_date: this.promotions.startDate,
      end_date: this.promotions.endDate,
      status: this.promotions.status,
    };
    // console.log(data);
  }
}
