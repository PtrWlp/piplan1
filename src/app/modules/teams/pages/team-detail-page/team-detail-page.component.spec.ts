import {TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {TeamsModule} from '../../teams.module';
import {TestsModule} from '../../../../shared/modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';
import {PiplanService} from '../../../../shared/service/piplan.service';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {APP_CONFIG, AppConfig} from '../../../../configs/app.config';
import {TeamDetailPageComponent} from './team-detail-page.component';

describe('TeamDetailPage', () => {
  let fixture;
  let component;
  let piplanService;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot(),
        TeamsModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: 'BzTvl77YsRTtdihH0jeh'
              })
            }
          }
        },
        PiplanService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamDetailPageComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
    piplanService = TestBed.get(PiplanService);
  }));

  it('should create team detail component', (() => {
    expect(component).toBeTruthy();
  }));
});
