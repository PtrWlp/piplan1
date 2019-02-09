import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Team} from '../../../shared/models/piplan.models';

@Component({
  selector: 'piplan-team-remove',
  templateUrl: './team-remove.component.html'
})

export class TeamRemoveComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
