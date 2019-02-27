import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Team} from '../../../shared/models/piplan.models';
import {TeamService} from '../../../shared/service/team.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'piplan-team-update',
  templateUrl: './team-update.component.html',
  styleUrls: ['./team-update.component.scss']
})

export class TeamUpdateComponent {

  team: Team;
  headerText: string;
  teamForm: FormGroup;
  error: string;
  disableJiraPrefix = false;
  disableName = false;
  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private teamService: TeamService,
              private formBuilder: FormBuilder) {

    this.headerText = 'Add team';
    if (data && data.team) {
      // apearently updating, not adding
      this.disableJiraPrefix = true;
      this.team = data.team;
      this.headerText = `Update team ${this.team.name}`;
      if (data.onlyCapacity) {
        this.disableName = true;
      }
    }

    this.teamForm = this.formBuilder.group({
      'jiraPrefix': new FormControl({value: this.team ? this.team.jiraPrefix : '',
                                     disabled: this.disableJiraPrefix}, Validators.required),
      'name': new FormControl({value: this.team ? this.team.name : '',
                               disabled: this.disableName}, Validators.required ),
      'averageSprintCapacity': new FormControl(this.team ? this.team.averageSprintCapacity : '', [Validators.pattern('^[0-9]*$')])
    });
  }

  saveTeam(team: any) {
    if (this.teamForm.valid) {
      this.teamService.saveTeam(new Team(this.teamForm.getRawValue())).then(() => {
        this.myNgForm.resetForm();
      }, () => {
        this.error = 'an error has ocurred';
      });
    }
  }

}
