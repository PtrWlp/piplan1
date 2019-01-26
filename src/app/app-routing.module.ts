import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error404PageComponent} from './shared/pages/error404-page/error404-page.component';
import {HomePageComponent} from './shared/pages/home-page/home-page.component';
import {AppConfig} from './configs/app.config';

const routes: Routes = [
  {path: '', component: HomePageComponent, pathMatch: 'full'},
  {path: ':pi/:team/planning', loadChildren: './modules/planning/planning.module#PlanningModule'},
  {path: 'teams', loadChildren: './modules/teams/teams.module#TeamsModule'},
  {path: AppConfig.routes.heroes, loadChildren: './modules/heroes/heroes.module#HeroesModule'},
  {path: AppConfig.routes.error404, component: Error404PageComponent},

  // otherwise redirect to 404
  {path: '**', redirectTo: '/' + AppConfig.routes.error404}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
