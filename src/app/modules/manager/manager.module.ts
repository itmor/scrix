import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ManagerRoutingModule } from './manager-routing.module';
import { UiPageModule } from '../ui/ui-page/ui-page.module';

import { ManagerComponent } from './components/manager.component';

@NgModule({
  declarations: [ManagerComponent],
  imports: [
    CommonModule, //
    UiPageModule,
    ManagerRoutingModule,
    ReactiveFormsModule,
  ],
})
export class ManagerModule {}
