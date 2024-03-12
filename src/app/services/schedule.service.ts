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
  config: WritableSignal<string> = signal(`2024-03-12
  8:30 [tomato] Mifgash
  9:10 [orange] Core
  9:50 [gold] Snack
  10:00 [lightgreen] Chug
  10:30 [cornflowerblue] Holidays
  11:00 [mediumpurple] Tefilah
  11:25 [white] Clean up
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
