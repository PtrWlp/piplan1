import {async, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MaterialModule} from '../../modules/material.module';
import {TestsModule} from '../../modules/tests.module';
import {PiplanService} from '../../../shared/service/piplan.service';
import {ProgressBarService} from '../../../core/services/progress-bar.service';
import {Error404PageComponent} from './error404-page.component';
import {APP_CONFIG, AppConfig} from '../../../configs/app.config';

describe('Error404Page', () => {
  let fixture;
  let component;
  let progressBarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        MaterialModule
      ],
      declarations: [
        Error404PageComponent
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        PiplanService,
        ProgressBarService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Error404PageComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
    progressBarService = TestBed.get(ProgressBarService);
  }));

  it('should create nav component', (() => {
    expect(component).toBeTruthy();
  }));
});
