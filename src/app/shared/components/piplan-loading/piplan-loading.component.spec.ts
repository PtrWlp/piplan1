import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PiplanLoadingComponent} from './piplan-loading.component';
import {TestsModule} from '../../modules/tests.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('PiplanLoadingComponent', () => {
  let component: PiplanLoadingComponent;
  let fixture: ComponentFixture<PiplanLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule
      ],
      declarations: [
        PiplanLoadingComponent
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
