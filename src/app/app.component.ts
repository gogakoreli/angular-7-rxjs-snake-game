import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getInputStream } from './input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private unsubscribe$ = new Subject<boolean>();

  constructor() {
    getInputStream()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(input => {
        console.log(input);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
