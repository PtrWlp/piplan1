import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TeamRoutingModule} from './teams-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {TeamsListPageComponent} from './pages/teams-list-page/teams-list-page.component';
import {TeamDetailPageComponent} from './pages/team-detail-page/team-detail-page.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TeamRoutingModule
  ],
  declarations: [
    TeamsListPageComponent,
    TeamDetailPageComponent
  ]
})

export class TeamsModule {
}
