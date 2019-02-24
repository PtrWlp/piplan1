import {TestBed} from '@angular/core/testing';
import {UtilsHelperService} from './utils-helper.service';

describe('UtilsHelperService', () => {
  let utilsHelperService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilsHelperService
      ]
    });

    utilsHelperService = TestBed.get(UtilsHelperService);
  });

  it('should create instance', (() => {
    expect(utilsHelperService).toBeDefined();
  }));

  it('should return fadeInOut trigger', (() => {
    expect(UtilsHelperService.fadeInOut().name).toBe('fadeInOut');
  }));

  it('should check if browser is valid', (() => {
    expect(UtilsHelperService.isBrowserValid()).toBe(true);
  }));
});
