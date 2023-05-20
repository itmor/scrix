import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UiPageComponent } from './ui-page.component';

@NgModule({
  declarations: [UiPageComponent],
  exports: [UiPageComponent],
  imports: [CommonModule],
})
export class UiPageModule {}
