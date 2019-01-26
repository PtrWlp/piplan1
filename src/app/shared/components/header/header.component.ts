import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  @Input() pi: string;
  @Input() teamName: string;
  @Input() hideBackButton: boolean;

  constructor() {
  }

}
