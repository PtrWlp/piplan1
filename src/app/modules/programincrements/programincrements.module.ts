import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProgramIncrementRoutingModule} from './programincrements-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {ProgramIncrementsComponent} from './programincrements.component';
import {ProgramIncrementRemoveComponent} from './programincrement-remove/programincrement-remove.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ProgramIncrementRoutingModule
  ],
  declarations: [
    ProgramIncrementsComponent,
    ProgramIncrementRemoveComponent
  ],
  entryComponents: [
    ProgramIncrementRemoveComponent
  ]
})

export class ProgramIncrementsModule {
}
