import {async, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {PlanningModule} from './planning.module';
import {TestsModule} from '../../shared/modules/tests.module';
import {Observable, of} from 'rxjs';
import { Story, Team, ProgramIncrement, Sprint } from '../../shared/models/piplan.models';
import {PiplanService} from '../../shared/service/piplan.service';
import {TeamService} from '../../shared/service/team.service';
import { ProgramIncrementService } from 'src/app/shared/service/program-increment.service';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {PlanningComponent} from './planning.component';
import { Router} from '@angular/router';

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
    saveSprintCapacity(sprint: Sprint): Promise<any> {
      return Promise.resolve();
    }
  };

  const mockProgramIncrementService = {
    getProgramIncrement(id: string): Observable<any>  {
      return of([]);
    },
  };
  const mockTeamService = {
    getTeam(): Observable<any>  {
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
        {provide: ProgramIncrementService, useValue: mockProgramIncrementService},
        {provide: TeamService, useValue: mockTeamService}
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
