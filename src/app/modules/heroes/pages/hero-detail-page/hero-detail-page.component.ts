import {Component, OnInit} from '@angular/core';
import {Hero} from '../../../../shared/service/piplan.models';
import {PiplanService} from '../../../../shared/service/piplan.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {AppConfig} from '../../../../configs/app.config';
import {UtilsHelperService} from '../../../../core/services/utils-helper.service';

@Component({
  selector: 'piplan-hero-detail-page',
  templateUrl: './hero-detail-page.component.html',
  styleUrls: ['./hero-detail-page.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class HeroDetailPageComponent implements OnInit {

  hero: Hero;
  canVote: boolean;

  constructor(private piplanService: PiplanService,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const heroId = this.activatedRoute.snapshot.paramMap.get('id');
    // this.piplanService.getHero(heroId).subscribe((hero: Hero) => {
    //   this.hero = hero;
    // });
  }

  dynamicImport() {
    import('html2canvas').then((html2canvas: any) => {
      html2canvas.default(document.getElementById('hero-detail')).then((canvas) => {
        window.open().document.write('<img src="' + canvas.toDataURL() + '" />');
      });
    });
  }

  goBack(): void {
    this.location.back();
  }

  goToTheAnchor(): void {
    this.router.navigate([`/${AppConfig.routes.heroes}/${this.hero.id}`], {fragment: 'hero-detail'});
  }
}
