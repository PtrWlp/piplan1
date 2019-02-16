import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TestsModule} from '../../modules/tests.module';
import {ProgramIncrementService} from '../../service/program-increment.service';
import {TeamService} from '../../service/team.service';
import {HomePageComponent} from './home-page.component';
import {APP_CONFIG, AppConfig} from '../../../configs/app.config';
import {Observable, of} from 'rxjs';
import {Team, ProgramIncrement} from '../../models/piplan.models';

describe('HomePage', () => {
  let fixture;
  let component;
  let programIncrementService;
  const programIncrements = [
    new ProgramIncrement({id: 'test1', name: 'PI01', start: '2019-01-01'}),
    new ProgramIncrement({id: 'test2', name: 'PI02', start: '2019-02-01'})
  ];

  const teams = [
    new Team({id: 'test1', name: 'teama', jiraPrefix: 'BWA-', averageSprintCapacity: 40}),
    new Team({id: 'test2', name: 'teamb', jiraPrefix: 'BWB-', averageSprintCapacity: 41}),
    new Team({id: 'test3', name: 'teamc', jiraPrefix: 'BWC-', averageSprintCapacity: 43})
  ];

  const mockProgramIncrementService = {
    getProgramIncrements(): Observable<any>  {
      return of(programIncrements);
    },
  };

  const mockTeamService = {
    getTeams(): Observable<any>  {
      return of(teams);
    },
  };


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
        {provide: ProgramIncrementService, useValue: mockProgramIncrementService},
        {provide: TeamService, useValue: mockTeamService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.debugElement.componentInstance;
    programIncrementService = TestBed.get(ProgramIncrementService);
  }));

  it('should create piplan top component', (() => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should initialize component', fakeAsync(() => {
    spyOn(programIncrementService, 'getProgramIncrements').and.returnValue(of(programIncrements));
    fixture.detectChanges();
    tick();
    expect(component.programIncrements.length).toBe(2);
    expect(component.teams.length).toBe(3);
  }));
});
