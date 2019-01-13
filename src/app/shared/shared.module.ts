import {NgModule} from '@angular/core';
import {MaterialModule} from './modules/material.module';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {HeaderComponent} from './components/header/header.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {Error404PageComponent} from './pages/error404-page/error404-page.component';
import {NgxExampleLibraryModule} from '@ismaestro/ngx-example-library';
import {NgxScrollToFirstInvalidModule} from '@ismaestro/ngx-scroll-to-first-invalid';
import {WebStorageModule} from 'ngx-store';
import {LoadingPlaceholderComponent} from './components/loading-placeholder/loading-placeholder.component';

import {HomePageComponent} from './pages/home-page/home-page.component';
import {PiplanLoadingComponent} from './components/piplan-loading/piplan-loading.component';
import {HeroCardComponent} from './components/hero-card/hero-card.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    RouterModule,
    NgxExampleLibraryModule,
    WebStorageModule,
    NgxScrollToFirstInvalidModule
  ],
  declarations: [
    HomePageComponent,
    Error404PageComponent,
    HeaderComponent,
    SpinnerComponent,
    HeroCardComponent,
    PiplanLoadingComponent,
    LoadingPlaceholderComponent
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    NgxExampleLibraryModule,
    WebStorageModule,
    HeaderComponent,
    SpinnerComponent,
    HeroCardComponent,
    PiplanLoadingComponent,
    NgxScrollToFirstInvalidModule,
    LoadingPlaceholderComponent
  ]
})

export class SharedModule {
}
