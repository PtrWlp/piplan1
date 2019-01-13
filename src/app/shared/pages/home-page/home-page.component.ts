import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Hero, ProgramIncrement} from '../../../shared/service/piplan.models';
import {PiplanService} from '../../../shared/service/piplan.service';
import {AppConfig} from '../../../configs/app.config';
import {UtilsHelperService} from '../../../core/services/utils-helper.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class HomePageComponent implements OnInit {
  programIncrements: ProgramIncrement[] = null;

  constructor(private piplanService: PiplanService,
              private router: Router) {
  }

  ngOnInit() {
    this.piplanService.getProgramIncrements().subscribe((programIncrements: Array<ProgramIncrement>) => {
      this.programIncrements = programIncrements;
    });
  }

  fillMyDatabase() {
    this.piplanService.fillMyDatabase();
  }

  seePIDetails(programIncrement): void {
    this.router.navigate([programIncrement.name + '/teams']);
  }

}
