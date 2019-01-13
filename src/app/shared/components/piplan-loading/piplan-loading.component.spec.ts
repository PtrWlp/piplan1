import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PiplanLoadingComponent} from './piplan-loading.component';
import {TestsModule} from '../../modules/tests.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {APP_CONFIG, AppConfig} from '../../../configs/app.config';

describe('PiplanLoadingComponent', () => {
  let component: PiplanLoadingComponent;
  let fixture: ComponentFixture<PiplanLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        PiplanLoadingComponent
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiplanLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
