import {async, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {PlanningModule} from './planning.module';
import {TestsModule} from '../../shared/modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';
import {PiplanService} from '../../shared/service/piplan.service';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {PlanningComponent} from './planning.component';

describe('PlanningListComponent', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot(),
        PlanningModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        PiplanService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
  }));

  it('should create team list component', (() => {
    expect(component).toBeTruthy();
  }));
});
