import { Component, OnInit, Input } from '@angular/core';
import { SnakeState } from './models';

@Component({
  selector: 'app-snake-state',
  templateUrl: './snake-state.component.html',
  styleUrls: ['./snake-state.component.scss'],
})
export class SnakeStateComponent implements OnInit {
  @Input() state: SnakeState;

  constructor() {}

  ngOnInit(): void {}
}
