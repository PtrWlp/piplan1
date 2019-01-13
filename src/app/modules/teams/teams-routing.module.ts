import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TeamsComponent} from './teams.component';

const teamsRoutes: Routes = [
  {path: '', component: TeamsComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(teamsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class TeamRoutingModule {
}
