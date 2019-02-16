import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {APP_BASE_HREF} from '@angular/common';
import {TestsModule} from './shared/modules/tests.module';
import {AppRoutingModule} from './app-routing.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PiplanService} from './shared/service/piplan.service';
import {Observable, of} from 'rxjs';
import { Story, Sprint } from './shared/models/piplan.models';

import {CoreModule} from './core/core.module';
import {APP_CONFIG, AppConfig} from './configs/app.config';
import {SharedModule} from './shared/shared.module';
import {Title} from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let titleService: Title;

  const mockPiplanService = {
    getPlanning(): Observable<Story[]> {
      return of([]);
    },
    getSprints(): Observable<Sprint[]> {
      return of([]);
    },
    createStory(story: Story): Promise<any> {
      return Promise.resolve({ xx: 'yy' });
    },
    updateStory(story: Story): Promise<void> {
      return Promise.resolve();
    },
    deleteStory(story: Story): Promise<void> {
      return Promise.resolve();
    },
    saveSprint(sprint: Sprint): Promise<any> {
      return Promise.resolve();
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        CoreModule,
        SharedModule,
        AppRoutingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        Title,
        {provide: PiplanService, useValue: mockPiplanService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    titleService = TestBed.get(Title);
    fixture.detectChanges();
  });

  it('should create the app', (() => {
    expect(component).toBeTruthy();
  }));

  it('should change title meta tag in root path', (() => {
    expect(titleService.getTitle()).toBe('PI Planning');
  }));

  it('should check browser features', (() => {
    expect(component.checkBrowserFeatures()).toBeTruthy();
  }));
});
