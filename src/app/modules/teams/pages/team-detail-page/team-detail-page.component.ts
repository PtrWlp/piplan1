import {Component, OnInit} from '@angular/core';
import {Team} from '../../../../shared/service/piplan.models';
import {TeamService} from '../../../../shared/service/team.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {AppConfig} from '../../../../configs/app.config';
import {UtilsHelperService} from '../../../../core/services/utils-helper.service';

@Component({
  selector: 'app-team-detail-page',
  templateUrl: './team-detail-page.component.html',
  styleUrls: ['./team-detail-page.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class TeamDetailPageComponent implements OnInit {

  team: Team;
  canVote: boolean;

  constructor(private teamService: TeamService,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const teamId = this.activatedRoute.snapshot.paramMap.get('id');
    this.teamService.getTeam(teamId).subscribe((team: Team) => {
      this.team = team;
    });
  }

  dynamicImport() {
    import('html2canvas').then((html2canvas: any) => {
      html2canvas.default(document.getElementById('teame-detail')).then((canvas) => {
        window.open().document.write('<img src="' + canvas.toDataURL() + '" />');
      });
    });
  }

  goBack(): void {
    this.location.back();
  }

  goToTheAnchor(): void {
    this.router.navigate([`/${AppConfig.routes.teams}/${this.team.id}`], {fragment: 'teame-detail'});
  }
}
