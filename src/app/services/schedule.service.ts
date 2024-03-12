import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { ParserService } from './parser.service';
import { HDate } from '@hebcal/core';
import { Schedule } from '../schedule/schedule';

const STORAGE_KEY = 'time-display-app-config';
const SETTING_STORAGE_KEY = 'time-display-app-should-save';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  config: WritableSignal<string> = signal(`2024-05-17
8:30 [tomato] Item 1
9:10 [orange] Item 2
9:50 [gold] Item 3
10:00 [lightgreen] Item 4
10:30 [cornflowerblue] Item 5
11:00 [mediumpurple] Item 6
11:25 [white] Item 7
end 11:30`);
  items: Signal<Schedule> = computed(() => this.parser.parse(this.config()));
  hdate: Signal<string> = computed(() =>
    new HDate(this.items()[0].startTime.toJSDate()).render('en')
  );
  date: Signal<Date> = computed(() => this.items()[0].startTime.toJSDate());
  shouldSaveToLocalStorage: WritableSignal<boolean> = signal(true);

  constructor(private parser: ParserService) {
    effect(() => {
      if (this.shouldSaveToLocalStorage()) {
        localStorage.setItem(STORAGE_KEY, this.config());
      }
    });
    effect(() => {
      localStorage.setItem(SETTING_STORAGE_KEY, this.shouldSaveToLocalStorage() ? "true" : "false");
    })
  }

  init() {
    const shouldSave = localStorage.getItem(SETTING_STORAGE_KEY);
    if(shouldSave === "true") {
      this.shouldSaveToLocalStorage.set(true);
    } else if (shouldSave === "false") {
      this.shouldSaveToLocalStorage.set(false);
    }
    const val = localStorage.getItem(STORAGE_KEY);
    if (val && this.shouldSaveToLocalStorage()) {
      this.config.set(val);
    }
  }
}
