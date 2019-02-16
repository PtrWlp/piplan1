import {async, TestBed} from '@angular/core/testing';
import {ProgramIncrementService} from './program-increment.service';
import {APP_BASE_HREF} from '@angular/common';
import {TestsModule} from '../../shared/modules/tests.module';
import {Observable, of} from 'rxjs';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {AngularFirestore} from '@angular/fire/firestore';
import {ProgramIncrement} from '../models/piplan.models';
import {HttpErrorResponse} from '@angular/common/http';

describe('ProgramIncrementService', () => {
  const programIncrementId = 'PI10';
  let service: ProgramIncrementService;

  const collectionStub = {
    valueChanges: jasmine.createSpy('valueChanges').and.returnValue({})
  };

  const docStub = {
    valueChanges: jasmine.createSpy('get').and.returnValue({}),
    get: jasmine.createSpy('get').and.returnValue(of({data: {id: programIncrementId}}))
  };

  const angularFirestoreStub = {
    collection: jasmine.createSpy('doc').and.returnValue(collectionStub),
    doc: jasmine.createSpy('doc').and.returnValue(docStub)
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: AngularFirestore, useValue: angularFirestoreStub},
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

});
