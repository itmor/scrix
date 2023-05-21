import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UiLoaderComponent } from './ui-loader.component';

@NgModule({
  declarations: [UiLoaderComponent],
  exports: [UiLoaderComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class UiLoaderModule {}
