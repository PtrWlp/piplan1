import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {ProgramIncrement, Story, Sprint } from '../models/piplan.models';
import {catchError, map, tap} from 'rxjs/operators';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {LoggerService} from '../../core/services/logger.service';
import {AppConfig} from '../../configs/app.config';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {UtilsHelperService} from '../../core/services/utils-helper.service';

@Injectable({
  providedIn: 'root'
})
export class PiplanService {
  private planningCollection: AngularFirestoreCollection<Story>;
  private sprintsCollection: AngularFirestoreCollection<Sprint>;
  constructor(private afs: AngularFirestore,
              private snackBar: MatSnackBar) {

    this.planningCollection = this.afs.collection<Story>('planning', (planning) => {
      return planning.orderBy('jiraNumber', 'desc');
    });

    this.sprintsCollection = this.afs.collection<Sprint>('sprintCapacity', (sprints) => {
      return sprints.orderBy('name', 'desc');
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

  getPlanning(): Observable<Story[]> {
    return this.planningCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            return new Story({id: action.payload.doc.id, ...data});
          });
        }),
        // tap(() => LoggerService.log(`fetched stories in planning`)),
        catchError(UtilsHelperService.handleError('getPlanning', []))
      );
  }

  getStory(id: string): Observable<any> {
    return this.afs.doc(`${AppConfig.routes.planning}/${id}`).get().pipe(
      map((story) => {
        return new Story({id, ...story.data()});
      }),
      catchError(UtilsHelperService.handleError('getStory', []))
    );
  }

  createStory(story: Story): Promise<DocumentReference> {
    return this.planningCollection.add(JSON.parse(JSON.stringify(story))).then((document: DocumentReference) => {
      this.showSnackBar(`New Story created on backlog`);
      return document;
    }, (error) => {
      UtilsHelperService.handleError<any>('createStory', error);
      return error;
    });
  }

  updateStory(story: Story): Promise<void> {
    return this.afs.doc(`${AppConfig.routes.planning}/${story.id}`)
      .update(this.deepCopyStory(story));
  }

  deepCopyStory(story: Story) {
    // want to remove the 'editing' field. Shouldnt be in the database
    const { id, jiraNumber, description, points, piid, teamid, sprint} = story;
    return JSON.parse(JSON.stringify({ id, jiraNumber, description, points, piid, teamid, sprint}));
  }

  deleteStory(story: Story): Promise<void> {
    const result = this.afs.doc(`${AppConfig.routes.stories}/${story.id}`).delete();
    this.showSnackBar(`deleted story ${story.jiraNumber}`);
    return result;
  }

  getSprints(): Observable<Sprint[]> {
    return this.sprintsCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            return new Sprint({id: action.payload.doc.id, ...data});
          });
        }),
        // tap(() => LoggerService.log(`fetched stories in planning`)),
        catchError(UtilsHelperService.handleError('getSprints', []))
      );
  }


  saveSprint(sprint: Sprint): Promise<any> {
    sprint.id = `${sprint.piid}-${sprint.teamid}-${sprint.name}`;
    const data = JSON.parse(JSON.stringify(sprint));
    return this.sprintsCollection.doc(sprint.id).set(data);
  }



  showSnackBar(text): void {
    const config: any = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(text, 'OK', config);
  }
}
