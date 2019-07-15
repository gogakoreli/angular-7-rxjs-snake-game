import { Direction, Food, Snake, SnakePart } from './models';

export function defaultSnake(): Snake {
  const parts = [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 2 }];
  return {
    direction: Direction.East,
    head: parts[parts.length - 1],
    length: parts.length,
    parts,
    foodEaten: false,
  };
}

export function updateDirection(snake: Snake, direction: Direction): Snake {
  if (validNextDirection(snake.direction, direction)) {
    snake = {
      ...snake,
      direction,
    };
  }
  return snake;
}

export function moveToDirection(snake: Snake, food: Food): Snake {
  let newParts = snake.parts;
  const newHead = getNewHead(snake);
  newParts.push(newHead);

  return {
    ...snake,
    head: newHead,
    parts: newParts,
    length: newParts.length,
  };
}

export function snakeFoodEaten(snake: Snake, food: Food) {
  const foodEaten = hasFoodEaten(snake, food);
  let parts = snake.parts;
  if (!foodEaten) {
    parts = parts.filter((_, i) => i > 0);
  }

  return {
    ...snake,
    foodEaten,
    parts,
    length: parts.length,
  };
}

/**
 * @description shouldn't be used from outside of snake
 * this is mainly for checking by itself to set property foodEaten
 * @see snake.foodEaten for using from outside
 */
function hasFoodEaten(snake: Snake, food: Food): boolean {
  return snake.head.i === food.i && snake.head.j === food.j;
}

function getNewHead(snake: Snake) {
  const head = snake.head;
  let newHead: SnakePart;
  switch (snake.direction) {
    case Direction.North:
      newHead = { i: head.i - 1, j: head.j };
      break;
    case Direction.East:
      newHead = { i: head.i, j: head.j + 1 };
      break;
    case Direction.South:
      newHead = { i: head.i + 1, j: head.j };
      break;
    case Direction.West:
      newHead = { i: head.i, j: head.j - 1 };
      break;
  }
  return newHead;
}

function validNextDirection(curr: Direction, next: Direction): boolean {
  let result = false;
  if (next >= 0 && next <= 3) {
    switch (curr) {
      case Direction.North:
        result = next !== Direction.South;
        break;
      case Direction.East:
        result = next !== Direction.West;
        break;
      case Direction.South:
        result = next !== Direction.North;
        break;
      case Direction.West:
        result = next !== Direction.East;
        break;
      case Direction.None:
        result = false;
        break;
    }
  }
  return result;
}
