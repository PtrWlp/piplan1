import {browser, by, element} from 'protractor';

export class HomePage {
  static navigateTo(): any {
    return browser.get('/');
  }

  static getNumberStories(): any {
    return element.all(by.css('#planning mat-card')).count();
  }
}
