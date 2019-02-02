import {async, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {TeamsModule} from './teams.module';
import {TestsModule} from '../../shared/modules/tests.module';
import {PiplanService} from '../../shared/service/piplan.service';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {TeamsComponent} from './teams.component';

describe('TeamListComponent', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TeamsModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        PiplanService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
  }));

  it('should create team list component', (() => {
    expect(component).toBeTruthy();
  }));
});
