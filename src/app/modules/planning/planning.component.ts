import { Component, OnInit, ViewChild } from '@angular/core';
import { Story, Team, ProgramIncrement, Sprint } from '../../shared/models/piplan.models';
import { TeamService } from '../../shared/service/team.service';
import { ProgramIncrementService } from 'src/app/shared/service/program-increment.service';
import { PiplanService } from '../../shared/service/piplan.service';
import { TeamUpdateComponent } from '../../shared/components/team-update/team-update.component';
import { CsvImportComponent } from '../../shared/components/csv-import/csv-import.component';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import { UploadEvent, FileSystemFileEntry } from 'ngx-file-drop';
import { UtilsHelperService } from '../../core/services/utils-helper.service';
import * as moment from 'moment';

@Component({
  selector: 'piplan-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class PlanningComponent implements OnInit {

  planning: Story[];
  team: Team;
  programIncrement: ProgramIncrement;
  pi: string;
  error: string;
  teamJiraPrefix: string;
  sprints: any;
  fibo = [null, 1, 2, 3, 5, 8, 13, 21, 34, 9999];
  showOverview: boolean;
  holidays = {'2019-04-19': 'Good Friday',
              '2019-04-22': '2nd Easter',
              '2019-05-30': 'Ascension/Hemelvaart',
              '2019-06-10': '2nd Pentecost/Pinksteren',
              '2019-12-23': 'Office Closed',
              '2019-12-24': 'Office Closed',
              '2019-12-25': 'Christmas',
              '2019-12-26': 'Christmas',
              '2019-12-27': 'Office Closed',
              '2019-12-30': 'Office Closed',
              '2019-12-31': 'Office Closed',
              '2020-01-01': 'Newyearsday',
              '2020-04-09': 'Good Friday',
              '2020-04-13': '2nd Easter',
              '2020-04-22': 'Office Closed',
              '2020-04-27': 'Kingsday',
              '2020-05-04': 'Office Closed',
              '2020-05-05': 'Liberation Day',
              '2020-05-21': 'Ascension/Hemelvaart',
              '2020-05-22': 'Office Closed',
              '2020-06-01': '2nd Pentecost/Pinksteren',
              '2020-12-25': 'Christmas'};
  lastFileContent;


  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private teamService: TeamService,
    private programIncrementService: ProgramIncrementService,
    private piplanService: PiplanService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.showOverview = true;
    this.pi = this.activatedRoute.snapshot.paramMap.get('pi');
    this.teamJiraPrefix = this.activatedRoute.snapshot.paramMap.get('team');
    this.sprints = [
      { name: 'sprint1' },
      { name: 'sprint2' },
      { name: 'sprint3' },
      { name: 'sprint4' },
      { name: 'sprint5' },
      { name: 'sprint6' }
    ];

    this.programIncrementService.getProgramIncrement(this.pi).subscribe((programIncrement: ProgramIncrement) => {
      this.programIncrement = programIncrement;
    });

    this.piplanService.getPlanning().subscribe((planning: Array<Story>) => {
      this.planning = planning.filter(story => story.piid === this.pi && story.teamid === this.teamJiraPrefix);
    });

    this.refreshCapacityData();
  }

  refreshCapacityData() {
    this.sprints = [
      { name: 'sprint1' },
      { name: 'sprint2' },
      { name: 'sprint3' },
      { name: 'sprint4' },
      { name: 'sprint5' },
      { name: 'sprint6' }
    ];

    this.teamService.getTeam(this.teamJiraPrefix).subscribe((team: Team) => {
      this.team = team;
      this.sprints.forEach(sprint => {
        if (!sprint['capacity']) {
          sprint['capacity'] = team.averageSprintCapacity;
        }
      });
    });

    this.piplanService.getSprints().subscribe((sprints: Array<Sprint>) => {
      this.sprints.forEach(sprint => {
        const sprintDetails = sprints.filter(sprintDetail => {
          return sprintDetail.piid === this.pi &&
            sprintDetail.teamid === this.teamJiraPrefix &&
            sprintDetail.name === sprint.name;
        });
        if (sprintDetails.length > 0) {
          sprint.capacity = sprintDetails[0]['capacity'];
        }
      });
    });

  }

  createNewStory() {
    const newStory = new Story;

    newStory.piid = this.pi;
    newStory.teamid = this.teamJiraPrefix;
    newStory.jiraNumberPrefix = this.teamJiraPrefix;
    newStory.jiraNumber = undefined;
    newStory.sprint = 'backlog';
    newStory.description = 'new story';

    this.piplanService.createStory(new Story(newStory)).then(() => {
      // new story saved
    }, () => {
      this.error = 'errorHasOcurred';
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const story = event.item.data;
    const targetSprint = event.container.data['sprint'];

    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      moveItemInArray(event.container.data['stories'], event.previousIndex, event.currentIndex);
      // For now the order is not stored... TODO fix that
    } else {
      story.sprint = targetSprint;
      transferArrayItem(event.previousContainer.data['stories'],
        event.container.data['stories'],
        event.previousIndex,
        event.currentIndex);
    }

    // fix the sorting in the database
    let index = -1;
    event.container.data['stories'].forEach(singleStory => {
      index++;
      singleStory.sortKey = this.piplanService.makeSortKey(targetSprint, index);
      this.piplanService.updateStory(singleStory);
    });
  }

  dropTrashcan(event: CdkDragDrop<string[]>) {
    const story = event.item.data;
    this.piplanService.deleteStory(story);
  }

  emptyTrashcan() {
    this.getStoriesForSprint('trashcan').forEach(singleStory => {
      this.piplanService.deleteStory(singleStory);
    });
    this.showSnackBar(`trashcan empty`);
  }

  getStoriesForSprint(sprint) {
    return this.planning && this.planning.filter(story => story.sprint === sprint);
  }

  getStartOfSprint(sprintNumber) {
    if (!this.programIncrement) { return; }

    const addNrOfDays = sprintNumber * 14;
    return moment(this.programIncrement.start, 'YYYY-MM-DD').add(addNrOfDays, 'days').format('YYYY-MM-DD');
  }

  getNumberOfHolidays(sprintNumber) {
    if (!this.programIncrement) { return 0; }

    const holidayDates = Object.keys(this.holidays);

    const workdayOffset = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11];
    const startDate = moment(this.getStartOfSprint(sprintNumber), 'YYYY-MM-DD');
    let nrHolidays = 0;
    workdayOffset.forEach(addDays => {
      if (holidayDates.includes(moment(startDate).add(addDays, 'days').format('YYYY-MM-DD'))) {
        nrHolidays++;
      }
    });
    return nrHolidays;
  }

  getHolidayNames(sprintNumber) {
    if (!this.programIncrement) { return 0; }

    const holidayDates = Object.keys(this.holidays);

    const workdayOffset = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11];
    const startDate = moment(this.getStartOfSprint(sprintNumber), 'YYYY-MM-DD');
    const result = [];
    workdayOffset.forEach(addDays => {
      const dayToCompare = moment(startDate).add(addDays, 'days').format('YYYY-MM-DD');
      if (holidayDates.includes(dayToCompare)) {
        if (!result.includes(this.holidays[dayToCompare])) {
          result.push(this.holidays[dayToCompare]);
        }
      }
    });
    return result.join(', ');
  }

  getDisplayPoints(points) {
    return points ? points < 9998 ? points : '∞' : '?';
  }

  getPoints(sprint) {
    let points = 0;
    try {
      this.getStoriesForSprint(sprint).forEach(story => points += story.points);
    } catch (error) {
      points = undefined;
    }
    return this.getDisplayPoints(points);
  }

  openTeamEdit(team: Team) {
    const dialogRef = this.dialog.open(TeamUpdateComponent, {
      data: { team, onlyCapacity: true },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.team = null;
        this.refreshCapacityData();
      }
    });

  }

  changeSprintCapacity(sprint: Sprint, changeValue: number) {
    sprint.capacity += changeValue;
    sprint.piid = this.pi;
    sprint.teamid = this.teamJiraPrefix;
    if (sprint.capacity !== this.team.averageSprintCapacity) {
      this.piplanService.saveSprintCapacity(sprint);
    } else {
      this.piplanService.deleteSprintCapacity(sprint);
    }
  }

  captureScreen() {
    const data = document.getElementById('piplan_planning');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('l', 'mm', 'a3'); // A4 size page of PDF
      const imgWidth = pdf.internal.pageSize.getWidth() - 20;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(contentDataURL, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`PI-planning-${this.pi}-${this.team.id}.pdf`); // Generated PDF
    });
  }

  public importCsv(event: UploadEvent) {
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          const fileReader = new FileReader();
          fileReader.readAsText(file);
          fileReader.onload = (e) => {
            console.log(fileReader.result);
            this.lastFileContent = fileReader.result;
            const dialogRef = this.dialog.open(CsvImportComponent, {
              data: { pi: this.pi,
                      teamJiraPrefix: this.teamJiraPrefix,
                      fileContents: this.lastFileContent }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.showSnackBar(`Items imported`);
              }
            });
          };
        });
      }
    }
  }

  showSnackBar(message) {
    const config: any = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'OK', config);
  }
}
