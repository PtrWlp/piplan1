import {Injectable} from '@angular/core';
import {animate, AnimationTriggerMetadata, style, transition, trigger} from '@angular/animations';
import {Observable, of} from 'rxjs';
import {LoggerService} from './logger.service';

declare const require;
const bowser = require('bowser');

@Injectable({
  providedIn: 'root'
})
export class UtilsHelperService {

  static fadeInOut(): AnimationTriggerMetadata {
    return trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate(500, style({opacity: 1}))
      ]),
      transition(':leave', [
        animate(500, style({opacity: 0}))
      ])
    ]);
  }

  static isBrowserValid() {
    const browser = bowser.getParser(window.navigator.userAgent);
    return browser.satisfies({
      windows: {
        'internet explorer': '>10',
      },
      macos: {
        safari: '>10.1'
      },
      chrome: '>20.1.1432',
      firefox: '>31',
      opera: '>22'
    });
  }

  static handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      LoggerService.log(`${operation} failed: ${error.message}`);

      if (error.status >= 500) {
        throw error;
      }

      return of(result as T);
    };
  }

}
