import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Team, ProgramIncrement} from '../../../shared/service/piplan.models';
import {TeamService} from '../../../shared/service/team.service';
import {ProgramIncrementService} from '../../../shared/service/program-increment.service';
import {AppConfig} from '../../../configs/app.config';
import {UtilsHelperService} from '../../../core/services/utils-helper.service';
import { TeamsComponent } from 'src/app/modules/teams/teams.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class HomePageComponent implements OnInit {
  programIncrements: ProgramIncrement[] = null;
  teams: Team[] = null;
  selectedProgramIncrement = null;
  selectedTeam = null;
  selectionComplete = false;

  constructor(private teamService: TeamService,
              private programIncrementService: ProgramIncrementService,
              private router: Router) {
  }

  ngOnInit() {
    this.teamService.getTeams().subscribe((teams: Array<Team>) => {
      this.teams = teams;
    });
    this.programIncrementService.getProgramIncrements().subscribe((programIncrements: Array<ProgramIncrement>) => {
      this.programIncrements = programIncrements.map((pi) => {
        pi['selected'] = false;
        return pi;
    });
    });
  }

  // handleSelection(index) {
  //   console.log(this.programIncrements[index]);
  //   this.programIncrements[index]['selected'] = true;
  //   this.setSelectedProgramIncrement(this.programIncrements[index]);
  // }

  setSelectedProgramIncrement(programIncrement): void {
    this.selectedProgramIncrement = programIncrement;
    this.selectionComplete = (this.selectedProgramIncrement && this.selectedTeam);
    console.log(this.selectionComplete);
  }

  setSelectedTeam(team): void {
    this.selectedTeam = team;
    this.selectionComplete = (this.selectedProgramIncrement && this.selectedTeam);
    console.log(this.selectionComplete);
  }

  viewPlanning(selectedProgramIncrement, selectedTeam): void {
    console.log(selectedTeam);
    this.router.navigate([selectedProgramIncrement + '/' + selectedTeam + '/planning']);
  }

}
