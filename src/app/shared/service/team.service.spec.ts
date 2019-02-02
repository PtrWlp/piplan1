import {async, TestBed} from '@angular/core/testing';
import {TeamService} from './team.service';
import {APP_BASE_HREF} from '@angular/common';
import {TestsModule} from '../../shared/modules/tests.module';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {Team} from '../models/piplan.models';
import {HttpErrorResponse} from '@angular/common/http';

describe('TeamService', () => {
  const teamId = 'BzTvl77YsRTtdihH0jeh';
  let service: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        TeamService
      ]
    });

    service = TestBed.get(TeamService);
  });

  it('should get team by id ' + teamId, (() => {
    service.getTeam(teamId).subscribe((team: Team) => {
      expect(team.id).toEqual(teamId);
    });
  }));

  it('should fail getting team by no id', (() => {
    service.getTeam('noId').subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should fail creating empty team', (() => {
    service.saveTeam(new Team({
      'name': 'test',
      'jiraPrefix': 'test'
    })).then(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

});
