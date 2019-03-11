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
  jiraNumberPrefix: string;
  jiraNumber: number;
  description: string;
  points: number;
  piid: string;
  teamid: string;
  sprint: string;
  jiraNumberDisplay: String;
  editing: string;
  sortKey: string;
  needsJiraUpdate: boolean;

  constructor(story: any = {}) {
    this.id = story.id;
    this.jiraNumberPrefix = story.jiraNumberPrefix || '';
    this.jiraNumber = story.jiraNumber || null;

    this.jiraNumberDisplay = this.jiraNumberFormat(story);
    this.description = story.description || '';
    this.points = story.points || null;
    this.piid = story.piid || '';
    this.teamid = story.teamid || '';
    this.sprint = story.sprint || 'backlog';
    this.sortKey = story.sortKey || '';
    this.needsJiraUpdate = story.needsJiraUpdate || false;
  }

  jiraNumberFormat(story: any) {
    let formatted = '';
    if (story.jiraNumberPrefix) {
      formatted = story.jiraNumberPrefix + '-';
    }
    if (story.jiraNumber) {
      formatted += story.jiraNumber.toString();
    }
    return formatted;
  }

  serialize () {
    const plainObject = {};
    plainObject['id'] = this.id;
    plainObject['jiraNumberPrefix'] = this.jiraNumberPrefix;
    plainObject['jiraNumber'] = this.jiraNumber;

    plainObject['description'] = this.description;
    plainObject['points'] = this.points;
    plainObject['piid'] = this.piid;
    plainObject['teamid'] = this.teamid;
    plainObject['sprint'] = this.sprint;
    plainObject['sortKey'] = this.sortKey;
    plainObject['needsJiraUpdate'] = this.needsJiraUpdate;
    return plainObject;
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
