import {Component, OnInit, ViewChild} from '@angular/core';
import {Story, Team, ProgramIncrement} from '../../shared/models/piplan.models';
import {TeamService} from '../../shared/service/team.service';
import { ProgramIncrementService } from 'src/app/shared/service/program-increment.service';
import {PiplanService} from '../../shared/service/piplan.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import { ActivatedRoute, Router} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import {UtilsHelperService} from '../../core/services/utils-helper.service';
import { now } from 'moment';

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
  newStoryForm: FormGroup;
  error: string;
  teamJiraPrefix: string;
  sprints: any;
  fibo = [undefined, 1, 2, 3, 5, 8, 13, 21, 34, 9999];

  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private teamService: TeamService,
              private programIncrementService: ProgramIncrementService,
              private piplanService: PiplanService,
              private dialog: MatDialog,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder) {

                this.newStoryForm = this.formBuilder.group({
        'jiraNumber': new FormControl('', []),
        'description': new FormControl('', [Validators.required])
      });
  }

  ngOnInit() {
    this.pi = this.activatedRoute.snapshot.paramMap.get('pi');
    this.teamJiraPrefix = this.activatedRoute.snapshot.paramMap.get('team');
    // this.teamService.getTeams().subscribe((teams) => {
    //   this.team = teams.filter(team => team.jiraPrefix === this.teamJiraPrefix)[0];
    // });
    this.teamService.getTeam(this.teamJiraPrefix).subscribe((team: Team) => {
      this.team = team;
    });
    this.programIncrementService.getProgramIncrement(this.pi).subscribe((programIncrement: ProgramIncrement) => {
      this.programIncrement = programIncrement;
    });
    this.piplanService.getPlanning().subscribe((planning: Array<Story>) => {
      this.planning = planning.filter(story => story.piid === this.pi && story.teamid === this.teamJiraPrefix);
    });

    this.sprints = [
      {name: 'backlog'},
      {name: 'sprint1'},
      {name: 'sprint2'},
      {name: 'sprint3'},
      {name: 'sprint4'},
      {name: 'sprint5'}
    ];
  }

  createNewStory() {
    const newStory = new Story;
    newStory.piid = this.pi;
    newStory.teamid = this.teamJiraPrefix;
    newStory.jiraNumber = this.teamJiraPrefix + '-';
    newStory.sprint = 'backlog';
    newStory.description = 'new story';

    this.piplanService.createStory(new Story(newStory)).then(() => {
      console.log('new story saved');
    }, () => {
      this.error = 'errorHasOcurred';
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const story = event.item.data;
    const targetSprint = event.container.data['sprint'];

    if (targetSprint === 'trashcan') {
      this.piplanService.deleteStory(event.item.data['id']);
    } else if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data['stories'], event.previousIndex, event.currentIndex);
      // For now the order is not stored... TODO fix that
    } else {
      story.sprint = targetSprint;
      transferArrayItem(event.previousContainer.data['stories'],
                        event.container.data['stories'],
                        event.previousIndex,
                        event.currentIndex);
      this.piplanService.updateStory(story);
    }
  }

  getStories(sprint) {
    return this.planning && this.planning.filter(story => story.sprint === sprint);
    // return this.planning;
  }

  getStartOfSprint(sprintNumber) {
    const addNrOfDays = (sprintNumber - 1) * 14;
    const newDate = new Date(now()); // TODO GET PI START
    newDate.setDate(newDate.getDate() + addNrOfDays);
    return newDate.toISOString().slice(0, 10);
  }

  getDisplayPoints(points) {
    return points ? points < 9998 ? points : '∞' : '?';
  }

  updateStoryNumber(story, newValue) {
    story.number = newValue;
    this.piplanService.updateStory(story);
    story.editing = '';
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
      this.piplanService.saveTeamPlan(this.teamPlan);
    }
  }

  estimateDown(story) {
    const currentSpot = this.fibo.indexOf(story.points);
    if (currentSpot > 0) {
      story.points = this.fibo[currentSpot - 1];
      this.piplanService.saveTeamPlan(this.teamPlan);
    }
  }

  // createNewPlanning(newPlanning: any) {
  //   if (this.newStoryForm.valid) {
  //     this.teamService.createPlanning(new Story(newPlanning)).then(() => {
  //       this.myNgForm.resetForm();
  //     }, () => {
  //       this.error = 'errorHasOcurred';
  //     });
  //   }
  // }

  // deletePlanning(team: Story) {
  //   const dialogRef = this.dialog.open(PlanningRemoveComponent);
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.teamService.deletePlanning(team.id).then(() => {
  //         // this.planningService.showSnackBar('teamRemoved');
  //         alert('team removed');
  //       }, () => {
  //         this.error = 'teamDefault';
  //       });
  //     }
  //   });
  // }

}
