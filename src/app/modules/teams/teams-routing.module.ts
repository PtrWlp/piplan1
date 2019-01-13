import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TeamsListPageComponent} from './pages/teams-list-page/teams-list-page.component';
import {TeamDetailPageComponent} from './pages/team-detail-page/team-detail-page.component';

const teamsRoutes: Routes = [
  {path: '', component: TeamsListPageComponent},
  {path: ':pi', component: TeamDetailPageComponent}
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
