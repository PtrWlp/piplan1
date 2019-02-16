import {async, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {PlanningModule} from './planning.module';
import {TestsModule} from '../../shared/modules/tests.module';
import {Observable, of} from 'rxjs';
import { Story, Team, ProgramIncrement, Sprint } from '../../shared/models/piplan.models';
import {PiplanService} from '../../shared/service/piplan.service';
import { ProgramIncrementService } from 'src/app/shared/service/program-increment.service';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {PlanningComponent} from './planning.component';

describe('PlanningComponent', () => {
  let fixture;
  let component;
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

  const mockProgramIncrementService = {
    getProgramIncrement(id: string): Observable<any>  {
      return of([]);
    },
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        PlanningModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: PiplanService, useValue: mockPiplanService},
        {provide: ProgramIncrementService, useValue: mockProgramIncrementService}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
  }));

  it('should create planning component', (() => {
    expect(component).toBeTruthy();
  }));
});
