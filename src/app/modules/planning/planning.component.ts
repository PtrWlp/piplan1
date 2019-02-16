import { Component, OnInit, ViewChild } from '@angular/core';
import { Story, Team, ProgramIncrement, Sprint } from '../../shared/models/piplan.models';
import { TeamService } from '../../shared/service/team.service';
import { ProgramIncrementService } from 'src/app/shared/service/program-increment.service';
import { PiplanService } from '../../shared/service/piplan.service';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';


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

  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private teamService: TeamService,
    private programIncrementService: ProgramIncrementService,
    private piplanService: PiplanService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.pi = this.activatedRoute.snapshot.paramMap.get('pi');
    this.teamJiraPrefix = this.activatedRoute.snapshot.paramMap.get('team');
    // this.teamService.getTeams().subscribe((teams) => {
    //   this.team = teams.filter(team => team.jiraPrefix === this.teamJiraPrefix)[0];
    // });
    this.teamService.getTeam(this.teamJiraPrefix).subscribe((team: Team) => {
      this.team = team;
      this.sprints.forEach(sprint => {
        if (!sprint['capacity']) {
          sprint['capacity'] = team.averageSprintCapacity;
        }
      });
    });
    this.programIncrementService.getProgramIncrement(this.pi).subscribe((programIncrement: ProgramIncrement) => {
      this.programIncrement = programIncrement;
    });
    this.piplanService.getPlanning().subscribe((planning: Array<Story>) => {
      this.planning = planning.filter(story => story.piid === this.pi && story.teamid === this.teamJiraPrefix);
    });

    this.sprints = [
      { name: 'backlog' },
      { name: 'sprint1' },
      { name: 'sprint2' },
      { name: 'sprint3' },
      { name: 'sprint4' },
      { name: 'sprint5' }
    ];
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
      singleStory.sortKey = targetSprint + '-' + index;
      this.piplanService.updateStory(singleStory);
    });
  }

  trashcan(event: CdkDragDrop<string[]>) {
    const story = event.item.data;
    this.piplanService.deleteStory(story);
  }

  getStories(sprint) {
    return this.planning && this.planning.filter(story => story.sprint === sprint);
    // return this.planning;
  }

  getStartOfSprint(sprintNumber) {
    if (!this.programIncrement) { return; }

    const addNrOfDays = (sprintNumber - 1) * 14;
    return moment(this.programIncrement.start, 'YYYY-MM-DD').add(addNrOfDays, 'days').format('YYYY-MM-DD');
  }

  getDisplayPoints(points) {
    return points ? points < 9998 ? points : '∞' : '?';
  }

  getPoints(sprint) {
    let points = 0;
    try {
      this.getStories(sprint).forEach(story => points += story.points);
    } catch (error) {
      points = undefined;
    }
    return this.getDisplayPoints(points);
  }

  estimateUp(story) {
    const currentSpot = this.fibo.indexOf(story.points);
    if (currentSpot + 1 < this.fibo.length) {
      story.points = this.fibo[currentSpot + 1];
      this.piplanService.updateStory(story);
    }
  }

  estimateDown(story) {
    const currentSpot = this.fibo.indexOf(story.points);
    if (currentSpot > 0) {
      story.points = this.fibo[currentSpot - 1];
      this.piplanService.updateStory(story);
    }
  }

  changeSprintCapacity(sprint: Sprint, changeValue: number) {
    sprint.capacity += changeValue;
    sprint.piid = this.pi;
    sprint.teamid = this.teamJiraPrefix;
    this.piplanService.saveSprint(sprint);
  }

  public captureScreen() {
    const data = document.getElementById('piplan_planning');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`PI-planning-${this.pi}-${this.team.id}.pdf`); // Generated PDF
    });
  }

}
