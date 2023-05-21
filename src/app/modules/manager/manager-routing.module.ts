import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerComponent } from './components/manager.component';
import { ListComponent } from './components/list/list.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { ImageResourceViewComponent } from './components/image-resourse-view/image-resource-view.component';

const routes: Routes = [
  {
    path: 'manager',
    component: ManagerComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ListComponent,
      },
      {
        path: 'resource/:id',
        component: ImageResourceViewComponent,
      },
      {
        path: 'generator',
        component: GeneratorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutingModule {}
