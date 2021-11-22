import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PromotionsService} from '../../../../services/promotions.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import {Promotions} from "../../../../models/promotions.model";
import {PremiumsService} from "../../../../services/premiums.service";

@Component({
  selector: 'ngx-edit-premiums',
  templateUrl: './edit-premiums.component.html',
})
export class EditPremiumsComponent implements OnInit {
  id: '';
  error = '';
  submitted = false;
  promotions?: Promotions[];
  premiums: FormGroup;
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
    this.id = this.activatedRoute.snapshot.params.id;
    this.getPremium(this.id);
  }
  get f() {
    return this.premiums.controls;
  }
  getPremium(id): void {
    this.premiumsService.get(id).subscribe(
        data => {
          this.premiums = this.fb.group(
            {
              name: [data.name],
              price: [data.price],
              description: [data.description],
              promotionId: [data.promotionId ],
              status: [data.status]});
          this.retrievePromotion(data.promotionId);
        },
        error => {
          console.log(error);
        });
  }
  updatePremium(): any {
    this.submitted = true;

    // return validators
    if (this.premiums.invalid) {
      return false;
    }
    this.premiumsService.update(this.id, this.premiums.value).subscribe(
      (response) => {
        this.toastrService.success(response.message);
      },
      (error) => {
        this.toastrService.success(error);
      });
  }

  retrievePromotion(promotion_id): void {
    this.promotionsService.getAll()
      .subscribe(
        data => {
          const customData = data['rows'];
          const obj = [];
          customData.forEach((currentValue, index) => {
            if(currentValue.id == promotion_id){
              obj.push({ id: currentValue.id, name: currentValue.name });
              customData.splice(index,1);
            }
          });
          customData.forEach((currentValue, index) => {
            obj.push({ id: currentValue.id, name: currentValue.name });
          });
          this.promotions = obj;
        },
        error => {
          console.log(error);
        });
  }
}
