import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbListModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbTabsetModule, NbUserModule,
  NbBadgeModule,
} from '@nebular/theme';

import { ThemeModule } from '../../layouts/theme.module';
import { NotificationsRoutingModule, routedComponents } from './notifications-routing.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NotificationsRoutingModule,
    NbBadgeModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
  ],
})
export class NotificationsModule { }
