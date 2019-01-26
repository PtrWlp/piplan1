import {Component, OnInit, ViewChild} from '@angular/core';
import {Hero} from '../../../../shared/service/piplan.models';
import {PiplanService} from '../../../../shared/service/piplan.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router} from '@angular/router';
import {AppConfig} from '../../../../configs/app.config';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {TranslateService} from '@ngx-translate/core';
import {UtilsHelperService} from '../../../../core/services/utils-helper.service';
import {HeroRemoveComponent} from '../../components/hero-remove/hero-remove.component';

@Component({
  selector: 'piplan-heroes-list-page',
  templateUrl: './heroes-list-page.component.html',
  styleUrls: ['./heroes-list-page.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class HeroesListPageComponent implements OnInit {

  heroes: Hero[];
  newHeroForm: FormGroup;
  error: string;
  programIncrement: string;
  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private piplanService: PiplanService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private translateService: TranslateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder) {

    this.newHeroForm = this.formBuilder.group({
      'name': new FormControl('', [Validators.required]),
      'alterEgo': new FormControl('', [Validators.required])
    });

    this.onChanges();
  }

  ngOnInit() {
    this.programIncrement = this.activatedRoute.snapshot.paramMap.get('pi');
    // this.piplanService.getHeroes().subscribe((heroes: Array<Hero>) => {
    //   this.heroes = heroes;
    // });
  }

  createNewHero(newHero: any) {
    if (this.newHeroForm.valid) {
      // this.piplanService.createHero(new Hero(newHero)).then(() => {
      //   this.myNgForm.resetForm();
      // }, () => {
      //   this.error = 'errorHasOcurred';
      // });
    }
  }

  deleteHero(hero: Hero) {
    const dialogRef = this.dialog.open(HeroRemoveComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.piplanService.deleteHero(hero.id).then(() => {
        //   this.piplanService.showSnackBar('heroRemoved');
        // }, () => {
        //   this.error = 'heroDefault';
        // });
      }
    });
  }

  seeHeroDetails(hero): void {
    this.router.navigate([AppConfig.routes.heroes + '/' + hero.id]);
  }

  private onChanges() {
    this.newHeroForm.get('name').valueChanges.subscribe((value) => {
      if (value && value.length >= 3 && UtilsHelperService.isPalindrome(value)) {
        this.snackBar.open(this.translateService.instant(String(_('yeahPalindrome'))));
      } else {
        this.snackBar.dismiss();
      }
    });
  }
}
