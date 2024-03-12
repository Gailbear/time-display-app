import { Injectable, WritableSignal, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NowService {
  timer$: Observable<any>;
  now: WritableSignal<DateTime> = signal(DateTime.now())
  private override?: DateTime;

  constructor() {
    this.timer$ = interval(1000);
    this.timer$.subscribe(_ => {
      if(!this.override) this.now.set(DateTime.now())
    })
  }

  setOverride(val?: DateTime) {
    this.override = val;
  }
}
