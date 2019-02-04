import {Deserializable} from '../interfaces/deserializable.interface';
import * as moment from 'moment';

export class Team implements Deserializable {
  id: string;
  name: string;
  jiraPrefix: string;
  averageSprintCapacity: number;

  constructor(team: any = {}) {
    this.id = team.id;
    this.name = team.name || '';
    this.jiraPrefix = team.jiraPrefix || '';
    this.averageSprintCapacity = team.averageSprintCapacity;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class ProgramIncrement implements Deserializable {
  id: string;
  name: string;
  start: string;

  constructor(programIncrement: any = {}) {
    this.id = programIncrement.id;
    this.name = programIncrement.name || '';
    this.start = programIncrement.start || new Date().toJSON().slice(0, 10);
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class Story implements Deserializable {
  id: string;
  jiraNumber: string;
  description: string;
  points: number;
  piid: string;
  teamid: string;
  sprint: string;
  editing: string;

  constructor(story: any = {}) {
    this.id = story.id;
    this.jiraNumber = story.jiraNumber || '';
    this.description = story.description || '';
    this.points = story.points || null;
    this.piid = story.piid || '';
    this.teamid = story.teamid || '';
    this.sprint = story.sprint || 'backlog';
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
export class Sprint implements Deserializable {
  id: string;
  name: string;
  capacity: number;
  piid: string;
  teamid: string;

  constructor(sprint: any = {}) {
    this.id = sprint.name;
    this.name = sprint.name || '';
    this.capacity = sprint.capacity || null;
    this.piid = sprint.piid || '';
    this.teamid = sprint.teamid || '';
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
