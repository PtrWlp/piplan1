import {Component, OnInit, ViewChild} from '@angular/core';
import {Story, Team} from '../../shared/service/piplan.models';
import {TeamService} from '../../shared/service/team.service';
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
  newStoryForm: FormGroup;
  error: string;
  pi: string;
  teamJiraPrefix: string;
  sprints: any;
  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private teamService: TeamService,
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
    this.piplanService.getPlanning(this.pi, this.teamJiraPrefix).subscribe((planning: Array<Story>) => {
      this.planning = planning;
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

  createNewStory(newStory: any) {
    if (this.newStoryForm.valid) {
      newStory.piid = this.pi;
      newStory.teamid = this.team;

      this.piplanService.createStory(new Story(newStory)).then(() => {
        this.myNgForm.resetForm();
      }, () => {
        this.error = 'errorHasOcurred';
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.container.data['sprint'] === 'trashcan') {
      this.planning = this.planning.filter(story => {
        return (story.description !== event.item.data['description'] &&
                story.jiraNumber !== event.item.data['jiraNumber']);
      });
// SAVE IT      this.piplanService.saveTeamPlan(this.planning);
    } else if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data['stories'], event.previousIndex, event.currentIndex);
      // For now the order is not stored in localstorage... TODO fix that
    } else {
      event.item.data['sprint'] = event.container.data['sprint'];
      transferArrayItem(event.previousContainer.data['stories'],
                        event.container.data['stories'],
                        event.previousIndex,
                        event.currentIndex);
// SAVE IT      this.piplanService.saveTeamPlan(this.teamPlan);
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
