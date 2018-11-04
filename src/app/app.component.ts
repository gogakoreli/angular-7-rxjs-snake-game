import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  range,
  Subject
  } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  takeUntil
  } from 'rxjs/operators';
import { getInputStream } from './input';

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
    getInputStream()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(input => {
        console.log(input);
      });

    const range$ = this.range$.pipe(
      map(range => 6 - (range / 25 + 1)),
      takeUntil(this.unsubscribe$),
    );

    const interval$ = range$
      .pipe(
        switchMap(range => interval(500).pipe(filter(x => x % range === 0))),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(x => {
        console.log(x);
      });
  }

  public rangeChange(value: string) {
    const range = Number.parseInt(value);
    this.range$.next(range);
  }
}
