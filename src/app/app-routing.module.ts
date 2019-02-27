import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error404PageComponent} from './shared/pages/error404-page/error404-page.component';
import {HomePageComponent} from './shared/pages/home-page/home-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent, pathMatch: 'full'},
  {path: 'teams', loadChildren: './modules/teams/teams.module#TeamsModule'},
  {path: 'programincrements', loadChildren: './modules/programincrements/programincrements.module#ProgramIncrementsModule'},
  {path: ':pi/:team/planning', loadChildren: './modules/planning/planning.module#PlanningModule'},

  {path: '404', component: Error404PageComponent},

  // otherwise redirect to 404
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      enableTracing: false
    })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
