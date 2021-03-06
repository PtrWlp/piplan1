import {InjectionToken} from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: any = {
  routes: {
    teams: 'teams',
    programIncrements: 'programIncrements',
    planning: 'planning',
    error404: '404'
  }
};
