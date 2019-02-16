import {async, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {ProgramIncrementsModule} from './programincrements.module';
import {TestsModule} from '../../shared/modules/tests.module';
import {Observable, of} from 'rxjs';
import {ProgramIncrementService} from '../../shared/service/program-increment.service';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {ProgramIncrementsComponent} from './programincrements.component';

describe('ProgramIncrementListComponent', () => {
  let fixture;
  let component;
  const mockProgramIncrementService = {
    getProgramIncrement(id: string): Observable<any>  {
      return of([]);
    },
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        ProgramIncrementsModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: ProgramIncrementService, useValue: mockProgramIncrementService}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramIncrementsComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
  }));

  it('should create programincrement list component', (() => {
    expect(component).toBeTruthy();
  }));
});
