import {Component, OnInit, ViewChild} from '@angular/core';
import {Team} from '../../shared/service/piplan.models';
import {TeamService} from '../../shared/service/team.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import { Router} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import {UtilsHelperService} from '../../core/services/utils-helper.service';
import {TeamRemoveComponent} from './team-remove/team-remove.component';

@Component({
  selector: 'piplan-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class TeamsComponent implements OnInit {

  teams: Team[];
  newTeamForm: FormGroup;
  error: string;
  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private teamService: TeamService,
              private dialog: MatDialog,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {

    this.newTeamForm = this.formBuilder.group({
      'name': new FormControl('', [Validators.required]),
      'jiraPrefix': new FormControl('', [Validators.required])
    });

  }

  ngOnInit() {
    this.teamService.getTeams().subscribe((teams: Array<Team>) => {
      this.teams = teams;
    });
  }

  createNewTeam(newTeam: any) {
    if (this.newTeamForm.valid) {
      this.teamService.createTeam(new Team(newTeam)).then(() => {
        this.myNgForm.resetForm();
      }, () => {
        this.error = 'errorHasOcurred';
      });
    }
  }

  deleteTeam(team: Team) {
    const dialogRef = this.dialog.open(TeamRemoveComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.deleteTeam(team.id).then(() => {
          this.showSnackBar(`team ${team.name} removed`);
        }, () => {
          this.error = 'teamDefault';
        });
      }
    });
  }

  seeTeamDetails(team): void {
    if (team.default) {
      this.router.navigate([AppConfig.routes.teams + '/' + team.id]);
    }
  }

  showSnackBar(message) {
    const config: any = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'OK', config);
  }

}
