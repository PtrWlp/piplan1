import {async, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HeaderComponent} from './header.component';
import {TestsModule} from '../../modules/tests.module';
import {APP_CONFIG, AppConfig} from '../../../configs/app.config';

describe('HeaderComponent', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule
      ],
      declarations: [
        HeaderComponent
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
  }));

  it('should create header component with constructor', (() => {
    const instance = new HeaderComponent();
    expect(instance).toBeTruthy();
  }));

  it('should create header component', (() => {
    expect(component).toBeTruthy();
  }));

});
