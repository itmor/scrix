import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ManagerRoutingModule } from './manager-routing.module';
import { UiPageModule } from '../ui/ui-page/ui-page.module';
import { UiLoaderModule } from '../ui/ui-loader/ui-loader.module';

import { ManagerComponent } from './components/manager.component';
import { ListComponent } from './components/list/list.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { LayoutModule } from '../layout/layout.module';
import { ImageResourceViewComponent } from './components/image-resourse-view/image-resource-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ManagerComponent, GeneratorComponent, ListComponent, ImageResourceViewComponent],
  imports: [
    CommonModule, //
    UiPageModule,
    ManagerRoutingModule,
    ReactiveFormsModule,
    LayoutModule,
    UiLoaderModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
})
export class ManagerModule {}
