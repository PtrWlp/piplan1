import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TestsModule} from '../../modules/tests.module';
import {PiplanService} from '../../../shared/service/piplan.service';
import {HomePageComponent} from './home-page.component';
import {APP_CONFIG, AppConfig} from '../../../configs/app.config';
import {of} from 'rxjs';
import {Story} from '../../models/piplan.models';

describe('HomePage', () => {
  let fixture;
  let component;
  let piplanService;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
      ],
      declarations: [
        HomePageComponent
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        PiplanService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.debugElement.componentInstance;
    piplanService = TestBed.get(PiplanService);
  }));

  it('should create piplan top component', (() => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should initializße component', fakeAsync(() => {
    const planning = [
      new Story({jiraPrifix: 'test1'}),
      new Story({jiraPrifix: 'test2'})
    ];
    spyOn(piplanService, 'getPlanning').and.returnValue(of(planning));
    fixture.detectChanges();
    tick();
    expect(component.planning.length).toBe(2);
  }));
});
