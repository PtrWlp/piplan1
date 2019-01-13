import {Component, Input, OnInit} from '@angular/core';
import {AppConfig} from '../../../configs/app.config';
import {PiplanService} from '../../../shared/service/piplan.service';
import {Hero} from '../../../shared/service/piplan.models';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrls: ['./hero-card.component.scss']
})
export class HeroCardComponent implements OnInit {

  @Input() hero: Hero;

  canVote: boolean;

  constructor(private piplanService: PiplanService,
              private router: Router) {
  }

  ngOnInit() {
  }

  seeHeroDetails(hero): void {
    if (hero.default) {
      this.router.navigate([AppConfig.routes.heroes + '/' + hero.id]);
    }
  }

}
