import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Team } from './piplan.models';
import {catchError, map, tap} from 'rxjs/operators';
import {LoggerService} from '../../core/services/logger.service';
import {AppConfig} from '../../configs/app.config';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {UtilsHelperService} from '../../core/services/utils-helper.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsCollection: AngularFirestoreCollection<Team>;
  constructor(private afs: AngularFirestore) {

    this.teamsCollection = this.afs.collection<Team>('teams', (team) => {
      return team.orderBy('name');
    });

  }

  getTeams(): Observable<Team[]> {
    return this.teamsCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            return new Team({id: action.payload.doc.id, ...data});
          });
        }),
        tap(() => LoggerService.log(`fetched teams`)),
        catchError(UtilsHelperService.handleError('getTeams', []))
      );
  }

  getTeam(id: string): Observable<any> {
    return this.afs.doc(`${AppConfig.routes.teams}/${id}`).get().pipe(
      map((team) => {
        return new Team({id, ...team.data()});
      }),
      tap(() => LoggerService.log(`fetched team ${id}`)),
      catchError(UtilsHelperService.handleError('getTeam', []))
    );
  }

  createTeam(team: Team): Promise<any> {
    const data = JSON.parse(JSON.stringify(team));
    return this.teamsCollection.doc(team.jiraPrefix).set(data);
  }

  updateTeam(team: Team): Promise<void> {
    return this.afs.doc(`${AppConfig.routes.teams}/${team.id}`).update(JSON.parse(JSON.stringify(team))).then(() => {
      LoggerService.log(`updated team w/ id=${team.id}`);
      alert('team saved');
      // this.showSnackBar('saved');
    });
  }

  deleteTeam(id: string): Promise<void> {
    return this.afs.doc(`${AppConfig.routes.teams}/${id}`).delete();
  }

}
