import {NgModule} from '@angular/core';
import {MaterialModule} from './modules/material.module';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {Error404PageComponent} from './pages/error404-page/error404-page.component';
// import {NgxExampleLibraryModule} from '@ismaestro/ngx-example-library';
import {NgxScrollToFirstInvalidModule} from '@ismaestro/ngx-scroll-to-first-invalid';
import {WebStorageModule} from 'ngx-store';

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
    WebStorageModule,
    NgxScrollToFirstInvalidModule
  ],
  declarations: [
    HomePageComponent,
    Error404PageComponent,
    HeaderComponent,
    HeroCardComponent,
    PiplanLoadingComponent
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    WebStorageModule,
    HeaderComponent,
    HeroCardComponent,
    PiplanLoadingComponent,
    NgxScrollToFirstInvalidModule
  ]
})

export class SharedModule {
}
