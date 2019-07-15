import { Component, OnDestroy, OnInit } from '@angular/core';
import { getInputStream, InputKey, getPauseStream } from './input';
import { defaultFood, Direction, SnakeState } from './models';
import { defaultSnakeMap, randomFood, updateSnakeMap } from './snake-map';
import {
  BehaviorSubject,
  interval,
  Observable,
  Subject,
  animationFrameScheduler,
  never,
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
  startWith,
} from 'rxjs/operators';
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
    const sliderRange = Number.parseInt(value, 10);
    this.sliderRange$.next(sliderRange);
  }
}

export function getSnakeStateStream(
  sliderRange$: Observable<number>,
  unsubscribe$: Observable<boolean>,
) {
  let state: SnakeState = {
    snake: defaultSnake(),
    food: defaultFood(),
    snakeMap: defaultSnakeMap(),
    paused: true,
  };

  const input$ = getInputStream();
  const range$ = getRangeStream(sliderRange$);
  const interval$ = getIntervalStream(range$);
  const direction$ = getDirectionStream(input$, interval$);
  const pause$ = getPauseStream(input$);
  const pausableInterval$ = getPausableIntervalStream(interval$, pause$);
  const tick$ = getTickStream(pausableInterval$, direction$, unsubscribe$);

  const state$ = tick$.pipe(
    map((direction) => {
      state = { ...state, snake: updateDirection(state.snake, direction) };
      state = { ...state, snake: moveToDirection(state.snake, state.food) };
      state = { ...state, snake: snakeFoodEaten(state.snake, state.food) };
      state = checkFoodEaten(state);

      return state;
    }),
    switchMap((state) => pause$.pipe(map((paused) => ({ ...state, paused })))),
    startWith(state),
    map(onTick),
  );

  return state$;
}

export function onTick({
  snake,
  food,
  snakeMap,
  paused,
}: SnakeState): SnakeState {
  snakeMap = updateSnakeMap(snakeMap, snake, food);
  // const drawGrid = snakeMap.grid
  //   .map(x => x.map(y => (y.isSnake ? 'x' : y.isFood ? '*' : '.')).join(' '))
  //   .join('\n');
  // console.log(drawGrid);
  // console.log();
  return {
    snake,
    snakeMap,
    food,
    paused,
  };
}

export function getTickStream(
  pausableInterval$: Observable<number>,
  direction$: Observable<Direction>,
  unsubscribe$: Observable<boolean>,
) {
  const tick$ = pausableInterval$.pipe(
    observeOn(animationFrameScheduler),
    withLatestFrom(direction$),
    map(([_, dir]) => dir),
    takeUntil(unsubscribe$),
  );
  return tick$;
}

export function getIntervalStream(range$: Observable<number>) {
  const interval$ = range$.pipe(
    switchMap((range) => interval(100).pipe(filter((x) => x % range === 0))),
    share(),
  );
  return interval$;
}

export function getDirectionStream(
  input$: Observable<InputKey>,
  interval$: Observable<number>,
) {
  const direction$ = input$.pipe(
    map((key) => Direction[Direction[key]] as Direction),
    distinctUntilChanged(),
    filter((dir) => dir >= 0 && dir <= 3),

    concatMap((input) =>
      interval$.pipe(
        map((_) => input),
        take(1),
      ),
    ),
    startWith(Direction.None),
  );
  return direction$;
}

export function getPausableIntervalStream(
  interval$: Observable<number>,
  pause$: Observable<boolean>,
): Observable<number> {
  return pause$.pipe(switchMap((pause) => (pause ? never() : interval$)));
}

export function getRangeStream(sliderRange$: Observable<number>) {
  return sliderRange$.pipe(map((sliderRange) => 6 - (sliderRange / 25 + 1)));
}

export function checkFoodEaten(state: SnakeState) {
  if (state.snake.foodEaten) {
    state = randomFood(state);
  }
  return state;
}
