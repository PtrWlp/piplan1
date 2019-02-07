import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlanningRoutingModule} from './planning-routing.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SharedModule} from '../../shared/shared.module';
import {PlanningComponent} from './planning.component';
import {EditableFiedComponent} from '../../shared/components/editablefield/editablefield.component';
import {StoryComponent} from './story/story.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DragDropModule,
    PlanningRoutingModule
  ],
  declarations: [
    EditableFiedComponent,
    StoryComponent,
    PlanningComponent
  ]

})

export class PlanningModule {

}
