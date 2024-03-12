import { CommonModule } from '@angular/common';
import { Component, InputSignal, Signal, computed, input } from '@angular/core';
import { ScheduleItem } from './schedule-item';
import { DateTime, Interval } from 'luxon';
import { NowService } from '../services/now.service';
import humanizeDuration  from 'humanize-duration';

@Component({
  selector: 'app-schedule-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-item.component.html',
  styleUrl: './schedule-item.component.css',
})
export class ScheduleItemComponent {
  item: InputSignal<ScheduleItem> = input.required();
  start: Signal<DateTime> = computed(() => this.item().startTime);
  end: Signal<DateTime> = computed(() =>
    this.start().plus(this.item().duration)
  );
  minutes: Signal<number> = computed(() =>
    Math.trunc(this.item().duration.as('minutes'))
  );
  style: Signal<any> = computed(() => ({
    'background-color': this.item().color,
    height: `${this.minutes() * 2}px`,
  }));
  clazz: Signal<any> = computed(() => ({
    past: this.past(),
    current: this.current()
  }))
  interval: Signal<Interval> = computed(() =>
    Interval.fromDateTimes(this.start(), this.end())
  );
  past: Signal<boolean> = computed(() => this.interval().isBefore(this.nowService.now()));
  current: Signal<boolean> = computed(() =>
    this.interval().contains(this.nowService.now())
  );
  future: Signal<boolean> = computed(() =>
    this.interval().isAfter(this.nowService.now())
  );
  until: Signal<string> = computed(() =>
    humanizeDuration(this.start().diff(this.nowService.now()).toMillis(), {units: ['d', 'h', 'm'], round: true})
  );

  constructor(private nowService: NowService) {}
}
