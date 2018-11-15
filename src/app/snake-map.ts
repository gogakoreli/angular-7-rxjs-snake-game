import { MAP_HEIGHT, MAP_WIDTH } from './constants';
import {
  Food,
  Snake,
  SnakeMap,
  Tile
  } from './models';

export function defaultSnakeMap(): SnakeMap {
  const grid = emptyGrid();

  return {
    grid,
  };
}

export function drawSnakeAndFood(
  snakeMap: SnakeMap,
  snake: Snake,
  food: Food,
): SnakeMap {
  const grid = emptyGrid();
  snake.parts.forEach(part => {
    grid[part.i][part.j] = {
      isFood: false,
      isSnake: true,
    };
  });

  grid[food.i][food.j] = { isFood: true, isSnake: false };

  return {
    ...snakeMap,
    grid,
  };
}

function emptyGrid(): Tile[][] {
  let grid: Tile[][] = [];
  for (let i = 0; i < MAP_WIDTH; i++) {
    grid[i] = [];
    for (let j = 0; j < MAP_HEIGHT; j++) {
      grid[i][j] = { isFood: false, isSnake: false };
    }
  }
  return grid;
}
