import { Component, OnInit, Input } from '@angular/core';
import { SnakeState, Tile } from './models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-snake-state',
  templateUrl: './snake-state.component.html',
  styleUrls: ['./snake-state.component.scss'],
})
export class SnakeStateComponent implements OnInit {
  @Input() state: SnakeState;

  public get grid(): Tile[][] {
    return (this.state && this.state.snakeMap.grid) || [];
  }

  constructor() {}

  ngOnInit(): void {}

  public getTileClass(tile: Tile) {
    let res: {} = tile.isFood && {
      food: true,
    };
    res =
      (tile.isSnake && {
        snake: true,
      }) ||
      res;
    return res;
  }
}
