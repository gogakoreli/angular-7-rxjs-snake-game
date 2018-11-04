import {
  Direction,
  Food,
  Snake,
  SnakePart
  } from './models';

export function defaultSnake(): Snake {
  const head = {
    i: 0,
    j: 0,
  };
  return {
    direction: Direction.East,
    head,
    length: 1,
    parts: [head],
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
  if (!hasFoodEaten(snake, food)) {
    newParts = newParts.filter((_, i) => i > 0);
  }
  const newHead = getNewHead(snake);
  newParts.push(newHead);
  return {
    ...snake,
    head: newHead,
    parts: newParts,
    length: newParts.length,
  };
}

export function hasFoodEaten(snake: Snake, food: Food): boolean {
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
  let result = true;
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
  return result;
}
