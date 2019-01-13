import {Component, OnInit, ViewChild} from '@angular/core';
import {Team} from '../../../../shared/service/piplan.models';
import {TeamService} from '../../../../shared/service/team.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router} from '@angular/router';
import {AppConfig} from '../../../../configs/app.config';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {TranslateService} from '@ngx-translate/core';
import {UtilsHelperService} from '../../../../core/services/utils-helper.service';
import {TeamRemoveComponent} from '../../components/team-remove/team-remove.component';

@Component({
  selector: 'app-teams-list-page',
  templateUrl: './teams-list-page.component.html',
  styleUrls: ['./teams-list-page.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class TeamsListPageComponent implements OnInit {

  teams: Team[];
  newTeamForm: FormGroup;
  error: string;
  programIncrement: string;
  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private teamService: TeamService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private translateService: TranslateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder) {

    this.newTeamForm = this.formBuilder.group({
      'name': new FormControl('', [Validators.required]),
      'alterEgo': new FormControl('', [Validators.required])
    });

    this.onChanges();
  }

  ngOnInit() {
    this.programIncrement = this.activatedRoute.snapshot.paramMap.get('pi');
    // this.teamService.setCurrentPI(this.programIncrement);
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
          // this.teamService.showSnackBar('teamRemoved');
          alert('team removed');
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

  private onChanges() {
    this.newTeamForm.get('name').valueChanges.subscribe((value) => {
      if (value && value.length >= 3 && UtilsHelperService.isPalindrome(value)) {
        this.snackBar.open(this.translateService.instant(String(_('yeahPalindrome'))));
      } else {
        this.snackBar.dismiss();
      }
    });
  }
}
