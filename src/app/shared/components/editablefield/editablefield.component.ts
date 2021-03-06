import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'piplan-editablefield',
  templateUrl: './editablefield.component.html',
  styleUrls: ['./editablefield.component.scss']
})

export class EditableFiedComponent implements OnInit {
  @Input() public fieldValue;
  @Input() public linkPrefix;
  @Output() public inEditMode = new EventEmitter();
  @Output() public valueChanged = new EventEmitter();

  public currentValue;
  public isEditing: boolean;
  public isALink: boolean;

  constructor () {
  }

  setEditMode (editMode) {
    this.isEditing = editMode;
    this.inEditMode.emit(editMode);
  }

  updateValue(newValue) {
    if (newValue !== this.currentValue) {
      this.fieldValue = newValue;
      this.valueChanged.emit(newValue);
    }
    this.isEditing = false;
  }

  cancel() {
    this.fieldValue = this.currentValue;
    this.isEditing = false;
  }

  ngOnInit () {
    this.currentValue = this.fieldValue;
    this.isALink = (this.linkPrefix && this.linkPrefix !== '');
  }

}
