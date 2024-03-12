import { Component, Input, OnChanges, OnDestroy, OnInit, Signal, SimpleChanges, WritableSignal, computed, signal } from '@angular/core';
import { ScheduleItemComponent } from '../schedule-item/schedule-item.component';
import { CommonModule } from '@angular/common';
import { Schedule } from './schedule';
import { DateTime } from 'luxon';
import { Observable, Subscription, interval, map, of, tap } from 'rxjs';
import { NowService } from '../services/now.service';


@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [ScheduleItemComponent, CommonModule],
  providers: [NowService],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class ScheduleComponent implements OnChanges {
  @Input() schedule: Schedule = [];
  @Input() now?: DateTime = undefined;
  timer$!: Observable<DateTime>;
  start: WritableSignal<DateTime> = signal(DateTime.now())
  minutesSinceStart: Signal<number> = computed(() => Math.trunc(this.nowService.now()?.diff(this.start(), 'minutes').as('minutes')));
  nowStyle: Signal<any> = computed(() => ({top: `${this.minutesSinceStart() * 2}px`}))
  subscriptions = new Subscription();

  constructor(private nowService: NowService) {}

  ngOnChanges(changes: SimpleChanges) {
    if(changes['schedule']?.currentValue?.[0]) {
      this.start.set(changes['schedule'].currentValue[0]?.startTime)
    }
    if(changes['now']) {
      this.nowService.setOverride(changes['now'].currentValue);
    }
  }
}
