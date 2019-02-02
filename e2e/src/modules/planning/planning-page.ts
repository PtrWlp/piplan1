import {browser, by, element} from 'protractor';
import {AppConfig} from '../../../../src/app/configs/app.config';

export class PlanningPage {
  static navigateTo(): any {
    return browser.get(AppConfig.routes.planning);
  }

  static getNumberStories(): any {
    return element.all(by.css('#left mat-list-item')).count();
  }
}
