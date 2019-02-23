import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TeamRoutingModule} from './teams-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {TeamsComponent} from './teams.component';
import {TeamRemoveComponent} from './team-remove/team-remove.component';
import {TeamUpdateComponent} from './team-update/team-update.component';
import {MatSortModule, MatTableModule} from '@angular/material';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TeamRoutingModule,
    MatSortModule,
    MatTableModule,

  ],
  declarations: [
    TeamsComponent,
    TeamRemoveComponent,
    TeamUpdateComponent
  ],
  entryComponents: [
    TeamRemoveComponent,
    TeamUpdateComponent
  ]
})

export class TeamsModule {
}
