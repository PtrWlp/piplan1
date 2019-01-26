import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanningComponent} from './planning.component';

const planningRoutes: Routes = [
  {path: '', component: PlanningComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(planningRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class PlanningRoutingModule {
}
