import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const UP_ARR_KEY_CODE = 38;
const RIGHT_ARR_KEY_CODE = 39;
const DOWN_ARR_KEY_CODE = 40;
const LEFT_ARR_KEY_CODE = 37;

const W_KEY_CODE = 87;
const A_KEY_CODE = 65;
const S_KEY_CODE = 83;
const D_KEY_CODE = 68;

function isUpPressed(keyCode: number) {
  return keyCode === W_KEY_CODE || keyCode === UP_ARR_KEY_CODE;
}

function isRightPressed(keyCode: number) {
  return keyCode === D_KEY_CODE || keyCode === RIGHT_ARR_KEY_CODE;
}

function isDownPressed(keyCode: number) {
  return keyCode === S_KEY_CODE || keyCode === DOWN_ARR_KEY_CODE;
}

function isLeftPressed(keyCode: number) {
  return keyCode === A_KEY_CODE || keyCode === LEFT_ARR_KEY_CODE;
}

function getInputKey(keyCode: number): InputKey {
  let result = InputKey.None;
  if (isUpPressed(keyCode)) {
    result = InputKey.Up;
  } else if (isRightPressed(keyCode)) {
    result = InputKey.Right;
  } else if (isDownPressed(keyCode)) {
    result = InputKey.Down;
  } else if (isLeftPressed(keyCode)) {
    result = InputKey.Left;
  }
  return result; 
}

export function getInputStream(): Observable<InputKey> {
  return fromEvent(document, 'keydown').pipe(
    map((event: KeyboardEvent) => getInputKey(event && event.keyCode)),
  );
}

export enum InputKey {
  None = -1,
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}
