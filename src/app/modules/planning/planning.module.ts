import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlanningRoutingModule} from './planning-routing.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SharedModule} from '../../shared/shared.module';
import {PlanningComponent} from './planning.component';
// import {EditableFiedComponent} from './editablefield/editablefield.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DragDropModule,
//    EditableFiedComponent,
    PlanningRoutingModule
  ],
  declarations: [
    PlanningComponent
  ]
})

export class PlanningModule {

}
