import { MAP_HEIGHT, MAP_WIDTH } from './constants';
import { Food, Snake, SnakeMap, SnakeState, Tile } from './models';

export const SNAKE_HEAD_TILE = {
  isFood: false,
  isSnake: true,
  isSnakeHead: true,
};

export function defaultSnakeMap(): SnakeMap {
  const grid = emptyGrid();

  return {
    grid,
  };
}

export function updateSnakeMap(
  snakeMap: SnakeMap,
  snake: Snake,
  food: Food,
): SnakeMap {
  const grid = emptyGrid();
  grid[food.i][food.j] = { isFood: true, isSnake: false, isSnakeHead: false };
  snake.parts.forEach(part => {
    grid[part.i][part.j] = {
      isFood: false,
      isSnake: true,
      isSnakeHead: false,
    };
  });

  grid[snake.head.i][snake.head.j] = SNAKE_HEAD_TILE;

  return {
    ...snakeMap,
    grid,
  };
}

function emptyTile(snakeMap: SnakeMap, i: number, j: number) {
  const tile = snakeMap.grid[i][j];
  return !tile.isFood && !tile.isSnake;
}

function emptyGrid(): Tile[][] {
  return initGrid((i, j) => {
    return { isFood: false, isSnake: false, isSnakeHead: false };
  });
}

function initGrid(setItem: (i: number, j: number) => Tile): Tile[][] {
  let grid: Tile[][] = [];
  for (let i = 0; i < MAP_WIDTH; i++) {
    grid[i] = [];
    for (let j = 0; j < MAP_HEIGHT; j++) {
      grid[i][j] = setItem(i, j);
    }
  }
  return grid;
}

export function randomFood(state: SnakeState): SnakeState {
  while (true) {
    let i = Math.floor(Math.random() * MAP_WIDTH);
    let j = Math.floor(Math.random() * MAP_HEIGHT);

    if (emptyTile(state.snakeMap, i, j)) {
      state = {
        ...state,
        food: {
          i,
          j,
        },
      };
      break;
    }
  }
  return state;
}
