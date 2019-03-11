import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Story} from '../../../shared/models/piplan.models';
import { PiplanService } from '../../../shared/service/piplan.service';

@Component({
  selector: 'piplan-csv-import',
  templateUrl: './csv-import.component.html',
  styleUrls: ['./csv-import.component.scss']
})

export class CsvImportComponent {
  pi: string;
  teamJiraPrefix: string;
  foundSeparator: string;
  numberOfStories;
  storiesFound: Array<Story> = [];
  error;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private piplanService: PiplanService) {

    this.pi = data.pi;
    this.teamJiraPrefix = data.teamJiraPrefix;
    this.parseCsv(data.fileContents);

  }

  parseCsv(fileContents) {
    const lines = fileContents.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
    if (!lines || lines.length < 3) {
      this.error = 'ERROR: empty file';
      return;
    }
    this.numberOfStories = lines.length - 2; // headerline and last separator before eof

    const headerLine = lines[0];
    // Issue key,Issue id,Summary,Custom field (Story Points),Issue Type
    if (!this.checkValidHeader(headerLine)) {
      console.log('not a valid header');
      return;
    }

    const colJiraNumber = this.getColumNumber(headerLine, 'issue key');
    const colSummary = this.getColumNumber(headerLine, 'summary');
    const colPoints = this.getColumNumber(headerLine, 'story points');

    for (let index = 1; index < lines.length; index++) {
      const columns = lines[index].split(this.foundSeparator);
      if (columns.length > 1) { // last line is empty
        if (!columns[colJiraNumber].includes(this.teamJiraPrefix)) {
          this.error = `Stories of another project-team (${columns[colJiraNumber].split('-')[0]})`;
        } else {
          const newStory = new Story;

          newStory.piid = this.pi;
          newStory.teamid = this.teamJiraPrefix;
          newStory.jiraNumberPrefix = this.teamJiraPrefix;
          newStory.jiraNumber = columns[colJiraNumber].replace(this.teamJiraPrefix + '-', '');
          newStory.description = columns[colSummary];
          newStory.points = this.getPoints(columns[colPoints]);
          newStory.sprint = 'backlog';
          newStory.sortKey = this.piplanService.makeSortKey('backlog', index);
          this.storiesFound.push(newStory);
        }
      }
    }
  }

  checkValidHeader(headerLine) {
    let result = true;
    const check = headerLine.toLowerCase();
    if (headerLine.includes(';')) {
      this.foundSeparator = ';';
    } else if (headerLine.includes(',')) {
      this.foundSeparator = ',';
    } else {
      this.error = 'Expect comma separated file.';
      result = false;
    }
    if (!(check.includes('issue key') &&
          check.includes('summary') &&
          check.includes('story points'))) {
      this.error = 'Expect fields Issue key, Summary, Story Points and Issue Type';
      result = false;
    }
    return result; // if no errors found
  }

  getColumNumber(headerLine, columnName) {
    const columnHeaders = headerLine.toLowerCase().split(this.foundSeparator);
    let i = 0;
    let foundColumnNumber;
    columnHeaders.forEach(header => {
      if (header.includes(columnName)) {
        foundColumnNumber = i;
      }
      i++;
    });
    return foundColumnNumber;
  }

  getPoints(pointValue) {
    const result = parseInt(pointValue, 10);
    return result || null;
  }

  getNumberOfStories(fileContents) {
    const lines = fileContents.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
    // Must at least be a header line
    return lines.length > 1 ? lines.length - 1 : '?';
  }

  saveStories() {
    this.storiesFound.forEach(story => {
      story.needsJiraUpdate = false;
      this.piplanService.createStory(story).then(() => {
        // new story saved
      }, (err) => {
        this.error = err;
      });
    });
    console.log('Stories found:', this.storiesFound);

  }

  createNewStory(jiraNumber, description, points) {
    const newStory = new Story;

    newStory.piid = this.pi;
    newStory.teamid = this.teamJiraPrefix;
    newStory.jiraNumberPrefix = this.teamJiraPrefix;
    newStory.jiraNumber = jiraNumber;
    newStory.description = description;
    newStory.points = points;
    newStory.sprint = 'backlog';

    this.piplanService.createStory(new Story(newStory)).then(() => {
      // new story saved
    }, (err) => {
      this.error = err;
    });
  }

}
