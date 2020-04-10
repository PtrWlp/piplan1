import { Component, Input } from '@angular/core';
import { Story } from '../../../shared/models/piplan.models';
import { PiplanService } from '../../../shared/service/piplan.service';

@Component({
  selector: 'piplan-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})

export class StoryComponent {
  @Input() public story: Story;
  fibo = [null, 1, 2, 3, 5, 8, 13, 21, 34, 9999];
  sprintsWithNext = ['backlog', 'sprint1', 'sprint2', 'sprint3', 'sprint4', 'sprint5'];

  constructor (private piplanService: PiplanService) {
  }

  updateStoryNumber(story, newValue) {
    story.jiraNumberDisplay = newValue;
    story.needsJiraUpdate = true;
    this.piplanService.updateStory(story);
    story.editing = '';
  }

  updateStoryDescr(story, newValue) {
    story.description = newValue;
    story.needsJiraUpdate = true;
    this.piplanService.updateStory(story);
    story.editing = '';
  }

  estimateUp(story) {
    const currentSpot = this.fibo.indexOf(story.points);
    if (currentSpot + 1 < this.fibo.length) {
      story.points = this.fibo[currentSpot + 1];
      story.needsJiraUpdate = true;
      this.piplanService.updateStory(story);
    }
  }

  estimateDown(story) {
    const currentSpot = this.fibo.indexOf(story.points);
    if (currentSpot > 0) {
      story.points = this.fibo[currentSpot - 1];
      story.needsJiraUpdate = true;
      this.piplanService.updateStory(story);
    }
  }

  resetTouchedFlag(story) {
    if (confirm('Have you synced with Jira?')) {
      story.needsJiraUpdate = false;
      this.piplanService.updateStory(story);
    }
  }

  throwToTrashcan(story) {
    story.sprint = 'trashcan';
    this.piplanService.updateStory(story);
  }

  nextSprint(story) {
    const locator = this.sprintsWithNext.indexOf(story.sprint);
    if (story.sprint === 'sprint5') {
      story.sprint = 'sprint6';
    } else {
      story.sprint = this.sprintsWithNext[locator + 1];
    }
    this.piplanService.updateStory(story);
  }

  deleteStory(story) {
    this.piplanService.deleteStory(story);
  }

  getDisplayPoints(points) {
    return points ? points < 9998 ? points : '∞' : '?';
  }

}
