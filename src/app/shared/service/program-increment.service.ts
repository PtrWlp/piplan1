import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {ProgramIncrement } from '../models/piplan.models';
import {catchError, map, tap} from 'rxjs/operators';
import {LoggerService} from '../../core/services/logger.service';
import {AppConfig} from '../../configs/app.config';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {UtilsHelperService} from '../../core/services/utils-helper.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramIncrementService {
  private programIncrementsCollection: AngularFirestoreCollection<ProgramIncrement>;
  constructor(private afs: AngularFirestore) {

    this.programIncrementsCollection = this.afs.collection<ProgramIncrement>('programIncrements', (programIncrement) => {
      return programIncrement.orderBy('start');
    });

  }

  getProgramIncrements(): Observable<ProgramIncrement[]> {
    return this.programIncrementsCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            return new ProgramIncrement({id: action.payload.doc.id, ...data});
          });
        }),
        catchError(UtilsHelperService.handleError('getProgramIncrements', []))
      );
  }

  getProgramIncrement(id: string): Observable<any> {
    return this.afs.doc(`${AppConfig.routes.programIncrements}/${id}`).get().pipe(
      map((res) => {
        return new ProgramIncrement({id, ...res.data()});
      }),
      catchError(UtilsHelperService.handleError('getProgramIncrement', []))
    );
  }

  saveProgramIncrement(programIncrement: ProgramIncrement): Promise<any> {
    const data = JSON.parse(JSON.stringify(programIncrement));
    return this.programIncrementsCollection.doc(programIncrement.name).set(data);
  }

  deleteProgramIncrement(id: string): Promise<void> {
    return this.afs.doc(`${AppConfig.routes.programIncrements}/${id}`).delete();
  }

}
