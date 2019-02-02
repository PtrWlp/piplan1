import {HomePage} from './home-page';
import {browser} from 'protractor';

describe('Home page', function () {
  let page;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should contains stories', () => {
    HomePage.navigateTo();
    browser.driver.sleep(2000);
    expect<any>(HomePage.getNumberStories()).toBe(1);
  });
});
