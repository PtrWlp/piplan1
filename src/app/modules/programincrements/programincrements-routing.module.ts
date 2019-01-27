import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProgramIncrementsComponent} from './programincrements.component';

const programincrementsRoutes: Routes = [
  {path: '', component: ProgramIncrementsComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(programincrementsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ProgramIncrementRoutingModule {
}
