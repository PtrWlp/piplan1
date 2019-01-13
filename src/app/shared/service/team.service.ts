import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Team, ProgramIncrement } from './piplan.models';
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
  private PICollection: AngularFirestoreCollection<ProgramIncrement>;
  constructor(private afs: AngularFirestore) {

    this.teamsCollection = this.afs.collection<Team>('teams', (team) => {
      return team.orderBy('name');
    });

  }

  fillMyDatabase() {
    console.log('biddie25');
    const programIncrements = this.afs.collection<ProgramIncrement>(`programIncrements`, (programIncrement) => programIncrement);
    console.log(programIncrements.doc);
    const newPI = new ProgramIncrement;
    newPI.name = 'PI11';
    newPI.start = '2019-01-01';
    this.createPI(newPI);

  }
  createPI(programIncrement: ProgramIncrement): Promise<DocumentReference> {
    return this.PICollection.add(JSON.parse(JSON.stringify(programIncrement))).then((document: DocumentReference) => {
      LoggerService.log(`added PI w/ id=${document.id}`);
      return document;
    }, (error) => {
      UtilsHelperService.handleError<any>('createPI', error);
      return error;
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

  getTeamName(jiraPrefix: string): Observable<any> {
    const team = this.afs.collection<Team>('teams', ref => ref.where('jiraPrefix', '==', jiraPrefix));
    return of(team);
  }

  createTeam(team: Team): Promise<DocumentReference> {
    return this.teamsCollection.add(JSON.parse(JSON.stringify(team))).then((document: DocumentReference) => {
      LoggerService.log(`added team w/ id=${document.id}`);
      // his.showSnackBar('teamCreated');
      alert('team created');
      return document;
    }, (error) => {
      UtilsHelperService.handleError<any>('createTeam', error);
      return error;
    });
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
