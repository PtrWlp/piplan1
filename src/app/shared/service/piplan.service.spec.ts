import {async, TestBed} from '@angular/core/testing';
import {PiplanService} from './piplan.service';
import {APP_BASE_HREF} from '@angular/common';
import {TestsModule} from '../../shared/modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {Team} from './piplan.models';
import {HttpErrorResponse} from '@angular/common/http';

describe('PiplanService', () => {
  const teamId = 'BzTvl77YsRTtdihH0jeh';
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

  it('should get team by id ' + teamId, (() => {
    piplanService.getTeam(teamId).subscribe((team: Team) => {
      expect(team.id).toEqual(teamId);
    });
  }));

  it('should fail getting team by no id', (() => {
    piplanService.getTeam('noId').subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should fail creating empty team', (() => {
    piplanService.createTeam(new Team({
      'name': 'test',
      'alterEgo': 'test'
    })).then(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

});
