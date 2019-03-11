import {NgModule} from '@angular/core';
import {MaterialModule} from './modules/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {TeamUpdateComponent} from './components/team-update/team-update.component';
import {CsvImportComponent} from './components/csv-import/csv-import.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {Error404PageComponent} from './pages/error404-page/error404-page.component';
import {WebStorageModule} from 'ngx-store';

import {HomePageComponent} from './pages/home-page/home-page.component';
import {PiplanLoadingComponent} from './components/piplan-loading/piplan-loading.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule,
    WebStorageModule
  ],
  declarations: [
    HomePageComponent,
    Error404PageComponent,
    HeaderComponent,
    TeamUpdateComponent,
    CsvImportComponent,
    PiplanLoadingComponent
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    WebStorageModule,
    HeaderComponent,
    TeamUpdateComponent,
    CsvImportComponent,
    PiplanLoadingComponent
  ],
  entryComponents: [
    TeamUpdateComponent,
    CsvImportComponent
  ]
})

export class SharedModule {
}
