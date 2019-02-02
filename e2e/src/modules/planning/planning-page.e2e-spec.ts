import {PlanningPage} from './planning-page';
import {browser} from 'protractor';

describe('Planning page', function () {
  let page;

  beforeEach(() => {
    page = new PlanningPage();
  });

  it('should contains equal or more stories than default ones', () => {
    PlanningPage.navigateTo();
    browser.driver.sleep(2000);
    expect<any>(PlanningPage.getNumberStories()).toBeGreaterThanOrEqual(8);
  });
});
