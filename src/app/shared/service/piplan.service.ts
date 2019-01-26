import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {ProgramIncrement, Story } from './piplan.models';
import {catchError, map, tap} from 'rxjs/operators';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {LoggerService} from '../../core/services/logger.service';
import {AppConfig} from '../../configs/app.config';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {UtilsHelperService} from '../../core/services/utils-helper.service';

@Injectable({
  providedIn: 'root'
})
export class PiplanService {
  private planningCollection: AngularFirestoreCollection<Story>;
  constructor(private afs: AngularFirestore,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {

    this.planningCollection = this.afs.collection<Story>('planning', (planning) => {
      return planning.orderBy('jiraNumber', 'desc');
    });

  }

  private static handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      LoggerService.log(`${operation} failed: ${error.message}`);

      if (error.status >= 500) {
        throw error;
      }

      return of(result as T);
    };
  }

  getPlanning(pi, team): Observable<Story[]> {
    return this.planningCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            return new Story({id: action.payload.doc.id, ...data});
          });
        }),
        tap(() => LoggerService.log(`fetched stories in planning`)),
        catchError(UtilsHelperService.handleError('getPlanning', []))
      );
  }

  getStory(id: string): Observable<any> {
    return this.afs.doc(`${AppConfig.routes.heroes}/${id}`).get().pipe(
      map((hero) => {
        return new Story({id, ...hero.data()});
      }),
      tap(() => LoggerService.log(`fetched hero ${id}`)),
      catchError(UtilsHelperService.handleError('getStory', []))
    );
  }

  createStory(story: Story): Promise<DocumentReference> {
    return this.planningCollection.add(JSON.parse(JSON.stringify(story))).then((document: DocumentReference) => {
      LoggerService.log(`added story w/ id=${document.id}`);
      this.showSnackBar('heroCreated');
      alert('story created');
      return document;
    }, (error) => {
      UtilsHelperService.handleError<any>('createStory', error);
      return error;
    });
  }

  updateStory(hero: Story): Promise<void> {
    return this.afs.doc(`${AppConfig.routes.heroes}/${hero.id}`).update(JSON.parse(JSON.stringify(hero))).then(() => {
      LoggerService.log(`updated hero w/ id=${hero.id}`);
      this.showSnackBar('saved');
    });
  }

  deleteStory(id: string): Promise<void> {
    return this.afs.doc(`${AppConfig.routes.heroes}/${id}`).delete();
  }

  showSnackBar(name): void {
    this.translateService.get([String(_('heroCreated')), String(_('saved')),
      String(_('heroLikeMaximum')), String(_('heroRemoved'))], {'value': AppConfig.votesLimit}).subscribe((texts) => {
      const config: any = new MatSnackBarConfig();
      config.duration = AppConfig.snackBarDuration;
      this.snackBar.open(texts[name], 'OK', config);
    });
  }
}
