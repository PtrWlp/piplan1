import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TeamRoutingModule} from './teams-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {TeamsComponent} from './teams.component';
import {TeamRemoveComponent} from './team-remove/team-remove.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TeamRoutingModule
  ],
  declarations: [
    TeamsComponent,
    TeamRemoveComponent
  ],
  entryComponents: [
    TeamRemoveComponent
  ]
})

export class TeamsModule {
}
