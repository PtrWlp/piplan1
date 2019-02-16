import {async, TestBed} from '@angular/core/testing';
import {PiplanService} from './piplan.service';
import {APP_BASE_HREF} from '@angular/common';
import {TestsModule} from '../../shared/modules/tests.module';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {Story, Team, ProgramIncrement} from '../models/piplan.models';
import {HttpErrorResponse} from '@angular/common/http';

describe('PiplanService', () => {
  const storyId = 'BzTvl77YsRTtdihH0jeh';
  let piplanService: PiplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        PiplanService
      ]
    });

    piplanService = TestBed.get(PiplanService);
    // MOCK IT!!!
  });

  it('should get Story by id ' + storyId, (() => {
    piplanService.getStory(storyId).subscribe((story: Story) => {
      expect(story.id).toEqual(storyId);
    });
  }));

  it('should fail getting story by no id', (() => {
    piplanService.getStory('noId').subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should fail creating empty story', (() => {
    piplanService.updateStory(new Story({
      'id': 'test'
    })).then(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

});
