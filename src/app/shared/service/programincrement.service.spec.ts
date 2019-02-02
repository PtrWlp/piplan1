import {async, TestBed} from '@angular/core/testing';
import {ProgramIncrementService} from './programincrement.service';
import {APP_BASE_HREF} from '@angular/common';
import {TestsModule} from '../../shared/modules/tests.module';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {ProgramIncrement} from '../models/piplan.models';
import {HttpErrorResponse} from '@angular/common/http';

describe('ProgramIncrementService', () => {
  const programincrementId = 'BzTvl77YsRTtdihH0jeh';
  let service: ProgramIncrementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        ProgramIncrementService
      ]
    });

    service = TestBed.get(ProgramIncrementService);
  });

  it('should get programincrement by id ' + programincrementId, (() => {
    service.getProgramIncrement(programincrementId).subscribe((programincrement: ProgramIncrement) => {
      expect(programincrement.id).toEqual(programincrementId);
    });
  }));

  it('should fail getting programincrement by no id', (() => {
    service.getProgramIncrement('noId').subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should fail creating empty programincrement', (() => {
    service.createProgramIncrement(new ProgramIncrement({
      'name': 'test',
      'jiraPrefix': 'test'
    })).then(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

});
