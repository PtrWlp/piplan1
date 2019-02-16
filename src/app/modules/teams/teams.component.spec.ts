import {async, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {TeamsModule} from './teams.module';
import {Team} from '../../shared/models/piplan.models';
import {TestsModule} from '../../shared/modules/tests.module';
import {Observable, of} from 'rxjs';
import {TeamService} from '../../shared/service/team.service';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {TeamsComponent} from './teams.component';

describe('TeamListComponent', () => {
  let fixture;
  let component;
  const mockTeamService = {
    getTeams(): Observable<Team[]> {
      return of([]);
    },
    getTeam(id: string): Observable<any> {
      return of([]);
    },

    saveTeam(team: Team): Promise<any> {
      return Promise.resolve({ xx: 'yy' });
    },
    updateTeam(team: Team): Promise<void> {
      return Promise.resolve();
    },
    deleteTeam(id: string): Promise<void> {
      return Promise.resolve();
    }
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TeamsModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: TeamService, useValue: mockTeamService}
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
