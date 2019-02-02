import {TestBed} from '@angular/core/testing';
import {ProgressBarService} from './progress-bar.service';
import {TestsModule} from '../../shared/modules/tests.module';
import {PiplanService} from '../../shared/service/piplan.service';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';

describe('ProgressBarService', () => {
  let progressBarService;
  let piplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        ProgressBarService,
        PiplanService
      ]
    });

    progressBarService = TestBed.get(ProgressBarService);
    piplanService = TestBed.get(PiplanService);
  });

  it('should not be requestsRunning', (() => {
    const instance = new ProgressBarService();
    expect(instance).toBeTruthy();
  }));

  it('should not be requestsRunning', (() => {
    expect(progressBarService.requestsRunning).toBe(0);
  }));

  it('should increase and decrease the counter of requests running', (() => {
    progressBarService.increase();
    progressBarService.increase();
    expect(progressBarService.requestsRunning).toBe(2);
    progressBarService.decrease();
    expect(progressBarService.requestsRunning).toBe(1);
    progressBarService.decrease();
    expect(progressBarService.requestsRunning).toBe(0);
    progressBarService.decrease();
    expect(progressBarService.requestsRunning).toBe(0);
  }));
});
