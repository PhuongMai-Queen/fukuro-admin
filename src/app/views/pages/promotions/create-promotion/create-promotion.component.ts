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
    start_date: '',
    end_date: '',
    status: '',
  };
  submitted = false;
  constructor(private promotionsService: PromotionsService, public fb: FormBuilder) {}
  ngOnInit(): void {}
  savePromotion(): void {
    const data = {
      name: this.promotions.name,
      discount: this.promotions.discount,
      start_date: this.promotions.start_date,
      end_date: this.promotions.end_date,
      status: this.promotions.status,
    };
    // console.log(data);
  }
}
