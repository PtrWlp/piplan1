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
      return planning.orderBy('sortKey').orderBy('jiraNumberPrefix').orderBy('jiraNumber');
    });

    this.sprintsCollection = this.afs.collection<Sprint>('sprintCapacity', (sprints) => {
      return sprints.orderBy('name');
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
            data['jiraNumberDisplay'] = data['jiraNumberPrefix'] + '-' + data['jiraNumber'];
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
    // construct the databasefields for jira prefix and number
    const parts = story.jiraNumberDisplay.split('-');

    const jiraNumberSuffixChar = parts[1] ? parts[1].replace(/\D/g, '') : '';

    story.jiraNumberPrefix = parts[0];

    if (story.jiraNumberDisplay.includes('-') && jiraNumberSuffixChar !== '') {
      story.jiraNumber = parseInt(jiraNumberSuffixChar, 10);
    } else {
      story.jiraNumber = null;
    }

    return this.afs.doc(`${AppConfig.routes.planning}/${story.id}`)
      .update(story.serialize());
  }

  jiraNumberRemovePrecedingZeroes(dbValue: string = '') {
    // For sorting, we add preceding zeroes to numberpart of jiraNumber
    let result = dbValue;
    const parts = dbValue.split('-');
    const jiraNumberPrefix = parts[0];
    const jiraNumberSuffix = parts[1].replace(/\D/g, '');

    if (!dbValue.includes('-') || parts[1] === '') {
      result = dbValue;
    } else if (jiraNumberSuffix === '') {
      result = jiraNumberPrefix + '-';
    } else {
      result = jiraNumberPrefix + '-' + parseInt(jiraNumberSuffix, 10);
    }
    return result;

  }

  deleteStory(story: Story): Promise<void> {
    const result = this.afs.doc(`${AppConfig.routes.planning}/${story.id}`).delete();
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

  saveSprintCapacity(sprint: Sprint): Promise<any> {
    sprint.id = `${sprint.piid}-${sprint.teamid}-${sprint.name}`;
    const data = JSON.parse(JSON.stringify(sprint));
    return this.sprintsCollection.doc(sprint.id).set(data);
  }

  deleteSprintCapacity(sprint: Sprint): Promise<void> {
    const sprintId = `${sprint.piid}-${sprint.teamid}-${sprint.name}`;
    const result = this.afs.doc(`sprintCapacity/${sprintId}`).delete();
    // TODO Doesnt work
    return result;
  }

  showSnackBar(text): void {
    const config: any = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(text, 'OK', config);
  }

  makeSortKey(targetSprint, index) {
      let paddedIndex = String(index);
      while (paddedIndex.length < (3)) {
        paddedIndex = '0' + paddedIndex;
      }
    return targetSprint + '-' + paddedIndex;
  }
}
