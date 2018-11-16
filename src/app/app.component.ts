import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  filter,
  map,
  switchMap,
  takeUntil
  } from 'rxjs/operators';
import { getInputStream } from './input';
import {
  Direction,
  Food,
  Snake,
  SnakeMap,
  SnakeState
  } from './models';
import { defaultSnakeMap, randomFood, updateSnakeMap } from './snake-map';
import {
  defaultSnake,
  moveToDirection,
  updateDirection,
  updateFoodEaten,
} from './snake';
import {
  BehaviorSubject,
  interval,
  Observable,
  Subject,
  combineLatest,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<boolean>();
  private range$ = new BehaviorSubject<number>(50);

  constructor() {}

  ngOnInit(): void {
    this.initializeSubscription();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeSubscription() {
    let state: SnakeState = {
      snake: defaultSnake(),
      food: { j: 5, i: 0 },
      snakeMap: defaultSnakeMap(),
    };

    const direction$ = getInputStream().pipe(
      map(key => Direction[Direction[key]] as Direction),
      filter(dir => dir !== Direction.None),
    );

    const range$ = this.getRangeStream();

    range$
      .pipe(
        switchMap(range => interval(100).pipe(filter(x => x % range === 0))),
        takeUntil(this.unsubscribe$),
        s$ => combineLatest(s$, direction$),
      )
      .subscribe(([_, direction]: [number, Direction]) => {
        state = { ...state, snake: updateDirection(state.snake, direction) };
        state = { ...state, snake: moveToDirection(state.snake, state.food) };
        state = { ...state, snake: updateFoodEaten(state.snake, state.food) };
        state = this.updateFoodEaten(state);

        state = this.onTick(state);
      });
  }

  private updateFoodEaten(state: SnakeState) {
    if (state.snake.foodEaten) {
      state = randomFood(state);
    }
    return state;
  }

  private getRangeStream(): Observable<number> {
    return this.range$.pipe(map(range => 6 - (range / 25 + 1)));
  }

  private onTick({ snake, food, snakeMap }: SnakeState): SnakeState {
    snakeMap = updateSnakeMap(snakeMap, snake, food);
    const drawGrid = snakeMap.grid
      .map(x => x.map(y => (y.isSnake ? 'x' : y.isFood ? '*' : '.')).join(' '))
      .join('\n');
    console.log(drawGrid);
    console.log();
    return {
      snake,
      snakeMap,
      food,
    };
  }

  public rangeChange(value: string) {
    const range = Number.parseInt(value);
    this.range$.next(range);
  }
}
