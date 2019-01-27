import {async, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {ProgramIncrementsModule} from './programincrements.module';
import {TestsModule} from '../../shared/modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';
import {PiplanService} from '../../shared/service/piplan.service';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {ProgramIncrementsComponent} from './programincrements.component';

describe('ProgramIncrementListComponent', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot(),
        ProgramIncrementsModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        PiplanService
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
