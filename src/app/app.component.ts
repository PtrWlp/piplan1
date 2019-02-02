import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {NavigationEnd, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {AppConfig} from './configs/app.config';
import {LocalStorage} from 'ngx-store';
import {UtilsHelperService} from './core/services/utils-helper.service';

declare const require;
declare const Modernizr;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  @LocalStorage() language = 'en';
  isOnline: boolean;

  constructor(private title: Title,
              private meta: Meta,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.isOnline = navigator.onLine;
  }

  ngOnInit() {

    this.title.setTitle('PI Planning');

    this.onEvents();
    this.checkBrowser();
  }

  onEvents() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case '/':
            this.meta.updateTag({
              name: 'description',
              content: 'Support PI Planning'
            });
            break;
          case '/' + AppConfig.routes.planning:
            this.title.setTitle('PI Planning');
            this.meta.updateTag({
              name: 'description',
              content: 'Plan your teams stories, count the points'
            });
            break;
        }
      }
    });
  }

  checkBrowser() {
    if (UtilsHelperService.isBrowserValid()) {
      this.checkBrowserFeatures();
    } else {
      this.snackBar.open('our browser is not supported. Please use, Chrome, Firefox, Safari, Opera or IE>11', 'OK');
    }
  }

  checkBrowserFeatures() {
    let supported = true;
    for (const feature in Modernizr) {
      if (Modernizr.hasOwnProperty(feature) &&
        typeof Modernizr[feature] === 'boolean' && Modernizr[feature] === false) {
        supported = false;
        break;
      }
    }

    if (!supported) {
      this.snackBar.open('You are using an old browser, please update it and reload the page.', 'OK');
    }

    return supported;
  }
}
