import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Hero, ProgramIncrement } from './piplan.models';
import {catchError, map, tap} from 'rxjs/operators';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {LoggerService} from '../../../core/services/logger.service';
import {AppConfig} from '../../../configs/app.config';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PiplanService {
  private heroesCollection: AngularFirestoreCollection<Hero>;
  private PICollection: AngularFirestoreCollection<ProgramIncrement>;
  private currentPI: string;
  constructor(private afs: AngularFirestore,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {

    this.PICollection = this.afs.collection<Hero>('programIncrements', (PI) => {
      return PI.orderBy('name', 'desc');
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
      PiplanService.handleError<any>('createPI', error);
      return error;
    });
  }


  setCurrentPI(pi) {
    console.log('biddie1');
    this.currentPI = pi;
    this.heroesCollection = this.afs.collection<Hero>(`programIncrements/programIncrement/${pi}`, (hero) => {
      return hero.orderBy('name', 'desc');
    });


  }
  getHeroes(): Observable<Hero[]> {
    console.log('biddie2', this.currentPI);
    return this.heroesCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            return new Hero({id: action.payload.doc.id, ...data});
          });
        }),
        tap(() => LoggerService.log(`fetched heroes`)),
        catchError(PiplanService.handleError('getHeroes', []))
      );
  }

  getProgramIncrements(): Observable<ProgramIncrement[]> {
    return this.PICollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            return new Hero({id: action.payload.doc.id, ...data});
          });
        }),
        tap(() => LoggerService.log(`fetched programIncrements`)),
        catchError(PiplanService.handleError('getProgramIncrements', []))
      );
  }

  getHero(id: string): Observable<any> {
    return this.afs.doc(`${AppConfig.routes.heroes}/${id}`).get().pipe(
      map((hero) => {
        return new Hero({id, ...hero.data()});
      }),
      tap(() => LoggerService.log(`fetched hero ${id}`)),
      catchError(PiplanService.handleError('getHero', []))
    );
  }

  createHero(hero: Hero): Promise<DocumentReference> {
    return this.heroesCollection.add(JSON.parse(JSON.stringify(hero))).then((document: DocumentReference) => {
      LoggerService.log(`added hero w/ id=${document.id}`);
      this.showSnackBar('heroCreated');
      return document;
    }, (error) => {
      PiplanService.handleError<any>('createHero', error);
      return error;
    });
  }

  updateHero(hero: Hero): Promise<void> {
    return this.afs.doc(`${AppConfig.routes.heroes}/${hero.id}`).update(JSON.parse(JSON.stringify(hero))).then(() => {
      LoggerService.log(`updated hero w/ id=${hero.id}`);
      this.showSnackBar('saved');
    });
  }

  deleteHero(id: string): Promise<void> {
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
