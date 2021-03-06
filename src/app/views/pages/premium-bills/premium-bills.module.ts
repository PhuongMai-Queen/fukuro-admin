import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ng2-ckeditor';

import { ThemeModule } from '../../layouts/theme.module';

import { PremiumBillsRoutingModule, routedComponents } from './premium-bills-routing.module';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';

import { TagInputModule } from 'ngx-chips';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    ThemeModule,
    PremiumBillsRoutingModule,
    CKEditorModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class PremiumBillsModule { }
