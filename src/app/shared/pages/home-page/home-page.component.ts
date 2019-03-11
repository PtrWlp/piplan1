import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Team, ProgramIncrement} from '../../models/piplan.models';
import {TeamService} from '../../../shared/service/team.service';
import {ProgramIncrementService} from '../../../shared/service/program-increment.service';
import {UtilsHelperService} from '../../../core/services/utils-helper.service';
import {CookieService} from 'ngx-cookie-service';
import * as moment from 'moment';

@Component({
  selector: 'piplan-home-page',
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
              private router: Router,
              private cookieService: CookieService) {
  }

  ngOnInit() {
    if (this.cookieService.get('selectedTeam')) {
      this.selectedTeam = this.cookieService.get('selectedTeam');
    }
    this.teamService.getTeams().subscribe((teams: Array<Team>) => {
      this.teams = teams;
    });
    let closestStartDateFound = false;
    this.programIncrementService.getProgramIncrements().subscribe((programIncrements: Array<ProgramIncrement>) => {
      this.programIncrements = programIncrements.map((pi) => {
        pi['selected'] = false;
        if (!closestStartDateFound && moment(pi.start, 'YYYY-MM-DD').isSameOrAfter(moment())) {
          pi['selected'] = true;
          closestStartDateFound = true;
          this.selectedProgramIncrement = pi.name;
        }
        return pi;
      });
    });
  }

  setSelectedProgramIncrement(programIncrement): void {
    this.selectedProgramIncrement = programIncrement;
    this.selectionComplete = !!(this.selectedProgramIncrement && this.selectedTeam);
    console.log(this.selectionComplete);
  }

  setSelectedTeam(team): void {
    this.selectedTeam = team;
    this.selectionComplete = !!(this.selectedProgramIncrement && this.selectedTeam);
    console.log(this.selectionComplete);
  }

  viewPlanning(selectedProgramIncrement, selectedTeam): void {
    this.cookieService.set('selectedTeam', selectedTeam);
    this.router.navigate([selectedProgramIncrement + '/' + selectedTeam + '/planning']);
  }

}
