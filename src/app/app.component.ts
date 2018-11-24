import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  Observable,
  Subject,
  animationFrameScheduler,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
  take,
  concatMap,
  share,
  observeOn,
  distinctUntilChanged,
} from 'rxjs/operators';
import { getInputStream } from './input';
import { Direction, SnakeState } from './models';
import { defaultSnakeMap, randomFood, updateSnakeMap } from './snake-map';
import {
  defaultSnake,
  moveToDirection,
  updateDirection,
  snakeFoodEaten,
} from './snake';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<boolean>();
  private sliderRange$ = new BehaviorSubject<number>(50);

  public snakeState$: Observable<SnakeState>;

  constructor() {}

  ngOnInit(): void {
    this.snakeState$ = getSnakeStateStream(
      this.sliderRange$,
      this.unsubscribe$,
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public sliderRangeChange(value: string) {
    const sliderRange = Number.parseInt(value);
    this.sliderRange$.next(sliderRange);
  }
}

export function getSnakeStateStream(
  sliderRange$: Observable<number>,
  unsubscribe$: Observable<boolean>,
) {
  let state: SnakeState = {
    snake: defaultSnake(),
    food: { j: 5, i: 0 },
    snakeMap: defaultSnakeMap(),
  };

  const range$ = getRangeStream(sliderRange$);
  const interval$ = getIntervalStream(range$);
  const direction$ = getDirectionStream(interval$);
  const tick$ = getTickStream(interval$, direction$, unsubscribe$);

  const state$ = tick$.pipe(
    map(([_, direction]) => {
      state = { ...state, snake: updateDirection(state.snake, direction) };
      state = { ...state, snake: moveToDirection(state.snake, state.food) };
      state = { ...state, snake: snakeFoodEaten(state.snake, state.food) };
      state = checkFoodEaten(state);

      state = onTick(state);
      return state;
    }),
  );

  return state$;
}

export function onTick({ snake, food, snakeMap }: SnakeState): SnakeState {
  snakeMap = updateSnakeMap(snakeMap, snake, food);
  const drawGrid = snakeMap.grid
    .map(x => x.map(y => (y.isSnake ? 'x' : y.isFood ? '*' : '.')).join(' '))
    .join('\n');
  // console.log(drawGrid);
  // console.log();
  return {
    snake,
    snakeMap,
    food,
  };
}

export function getTickStream(
  interval$: Observable<number>,
  direction$: Observable<Direction>,
  unsubscribe$: Observable<boolean>,
) {
  const tick$ = interval$.pipe(
    observeOn(animationFrameScheduler),
    withLatestFrom(direction$),
    takeUntil(unsubscribe$),
  );
  return tick$;
}

export function getIntervalStream(range$: Observable<number>) {
  const interval$ = range$.pipe(
    switchMap(range => interval(100).pipe(filter(x => x % range === 0))),
    share(),
  );
  return interval$;
}

export function getDirectionStream(interval$: Observable<number>) {
  const input$ = getInputStream();

  const direction$ = input$.pipe(
    map(key => Direction[Direction[key]] as Direction),
    distinctUntilChanged(),
    filter(dir => dir !== Direction.None),

    concatMap(input =>
      interval$.pipe(
        map(_ => input),
        take(1),
      ),
    ),
  );
  return direction$;
}

export function getRangeStream(sliderRange$: Observable<number>) {
  return sliderRange$.pipe(map(sliderRange => 6 - (sliderRange / 25 + 1)));
}

export function checkFoodEaten(state: SnakeState) {
  if (state.snake.foodEaten) {
    state = randomFood(state);
  }
  return state;
}
