export interface SnakePart {
  i: number;
  j: number;
}

export interface Snake {
  head: SnakePart;
  parts: SnakePart[];
  direction: Direction;
  length: number;
}

export enum Direction {
  None = -1,
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

export interface Food {
  i: number;
  j: number;
}

export interface SnakeMap {
  grid: Tile[][];
}

export interface Tile {
  isFood: boolean;
  isSnake: boolean;
}
