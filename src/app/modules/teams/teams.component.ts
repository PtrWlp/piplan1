import {Component, OnInit, ViewChild} from '@angular/core';
import {Team} from '../../shared/models/piplan.models';
import {TeamService} from '../../shared/service/team.service';
import {MatDialog, MatSnackBar, MatSnackBarConfig, MatSort, MatTableDataSource } from '@angular/material';
import {UtilsHelperService} from '../../core/services/utils-helper.service';
import {TeamRemoveComponent} from './team-remove/team-remove.component';
import {TeamUpdateComponent} from '../../shared/components/team-update/team-update.component';

@Component({
  selector: 'piplan-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class TeamsComponent implements OnInit {

  teams: Team[];
  error: string;
  public dataSource = new MatTableDataSource<Team>();
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns = ['edit', 'jiraPrefix', 'name', 'averageSprintCapacity', 'delete'];

  constructor(private teamService: TeamService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.teamService.getTeams().subscribe((teams: Array<Team>) => {
      this.teams = teams;

      this.dataSource = new MatTableDataSource<Team>(this.teams);
      this.dataSource.sort = this.sort;

    });
  }

  deleteTeam(team: Team) {
    const dialogRef = this.dialog.open(TeamRemoveComponent, {
      data: { team },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.deleteTeam(team.id).then(() => {
          this.showSnackBar(`team ${team.name} removed`);
        }, (err) => {
          console.log(err);
          this.error = 'cannot delete.';
        });
      }
    });
  }

  addTeam() {
    const dialogRef = this.dialog.open(TeamUpdateComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showSnackBar(`team added`);
      }
    });
  }

  updateTeam(team: Team) {
    this.dialog.open(TeamUpdateComponent, {
      data: { team },
    });
  }

  showSnackBar(message) {
    const config: any = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'OK', config);
  }

}
