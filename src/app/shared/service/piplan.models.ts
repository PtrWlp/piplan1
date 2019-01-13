import {Deserializable} from '../../shared/interfaces/deserializable.interface';
import { Moment } from 'moment';

export class Team implements Deserializable {
  id: string;
  name: string;
  start: string;

  constructor(team: any = {}) {
    this.id = team.id;
    this.name = team.name || '';
    this.start = team.start || new Date().toJSON().slice(0, 10);
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
export class Hero implements Deserializable {
  id: string;
  name: string;
  start: string;

  constructor(hero: any = {}) {
    this.id = hero.id;
    this.name = hero.name || '';
    this.start = hero.start || new Date().toJSON().slice(0, 10);
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class ProgramIncrement implements Deserializable {
  // id: string;
  name: string;
  start: string;

  constructor(programIncrement: any = {}) {
    // this.id = programIncrement.id;
    this.name = programIncrement.name || '';
    this.start = programIncrement.start || new Date().toJSON().slice(0, 10);
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
