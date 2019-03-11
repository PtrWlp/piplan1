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

  constructor (private piplanService: PiplanService) {
  }

  updateStoryNumber(story, newValue) {
    story.jiraNumberDisplay = newValue;
    this.piplanService.updateStory(story);
    story.editing = '';
  }

  updateStoryDescr(story, newValue) {
    story.description = newValue;
    this.piplanService.updateStory(story);
    story.editing = '';
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

  deleteStory(story) {
    this.piplanService.deleteStory(story);
  }

  getDisplayPoints(points) {
    return points ? points < 9998 ? points : '∞' : '?';
  }

}
