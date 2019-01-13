import {async, TestBed} from '@angular/core/testing';
import {ProgramIncrementService} from './program-increment.service';
import {APP_BASE_HREF} from '@angular/common';
import {TestsModule} from '../../shared/modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {ProgramIncrement} from './piplan.models';
import {HttpErrorResponse} from '@angular/common/http';

describe('ProgramIncrementService', () => {
  const programIncrementId = 'BzTvl77YsRTtdihH0jeh';
  let service: ProgramIncrementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        ProgramIncrementService
      ]
    });

    service = TestBed.get(ProgramIncrementService);
  });

  it('should get programIncrement by id ' + programIncrementId, (() => {
    service.getProgramIncrement(programIncrementId).subscribe((programIncrement: ProgramIncrement) => {
      expect(programIncrement.id).toEqual(programIncrementId);
    });
  }));

  it('should fail getting programIncrement by no id', (() => {
    service.getProgramIncrement('noId').subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should fail creating empty programIncrement', (() => {
    service.createProgramIncrement(new ProgramIncrement({
      'name': 'test',
      'jiraPrefix': 'test'
    })).then(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

});
