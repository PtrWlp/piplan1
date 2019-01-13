import {async, TestBed} from '@angular/core/testing';
import {PiplanService} from './piplan.service';
import {APP_BASE_HREF} from '@angular/common';
import {TestsModule} from '../../../shared/modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';
import {APP_CONFIG, AppConfig} from '../../../configs/app.config';
import {Hero} from './piplan.models';
import {HttpErrorResponse} from '@angular/common/http';

describe('PiplanService', () => {
  const heroId = 'BzTvl77YsRTtdihH0jeh';
  let piplanService: PiplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        PiplanService
      ]
    });

    piplanService = TestBed.get(PiplanService);
  });

  it('should get hero by id ' + heroId, (() => {
    piplanService.getHero(heroId).subscribe((hero: Hero) => {
      expect(hero.id).toEqual(heroId);
    });
  }));

  it('should fail getting hero by no id', (() => {
    piplanService.getHero('noId').subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should fail creating empty hero', (() => {
    piplanService.createHero(new Hero({
      'name': 'test',
      'alterEgo': 'test'
    })).then(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

});
