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
import { DemoService } from './demo.service';
import { Router } from '@angular/router';
import { HttpUrlEncodingCodec } from '@angular/common/http';

const STORAGE_KEY = 'time-display-app-config';
const SETTING_STORAGE_KEY = 'time-display-app-should-save';

@Injectable()
export class ScheduleService {
  config: WritableSignal<string> = signal("");
  items: Signal<Schedule> = computed(() => this.parser.parse(this.config()));
  hdate: Signal<string> = computed(() =>
    new HDate(this.items()[0].startTime.toJSDate()).render('en')
  );
  date: Signal<Date> = computed(() => this.items()[0].startTime.toJSDate());
  shouldSaveToLocalStorage: WritableSignal<boolean> = signal(true);

  constructor(private parser: ParserService, private demoService: DemoService,
    private router: Router) {
    effect(() => {
      if (this.shouldSaveToLocalStorage()) {
        localStorage.setItem(STORAGE_KEY, this.config());
      }
    });
    effect(() => {
      localStorage.setItem(SETTING_STORAGE_KEY, this.shouldSaveToLocalStorage() ? "true" : "false");
    })
    if(!this.config()) {
      this.config.set(this.demoService.makeDemoData());
    }
  }

  getLink(): string {
    console.log('config', this.config());
    const s = `/?s=${btoa(this.config())}`;
    console.log('s', s);
    return s;
  }

  init(s?: string | undefined) {
    const shouldSave = localStorage.getItem(SETTING_STORAGE_KEY);
    if(shouldSave === "true") {
      this.shouldSaveToLocalStorage.set(true);
    } else if (shouldSave === "false") {
      this.shouldSaveToLocalStorage.set(false);
    }
    // s loads from route params, if there is something
    // use that over local storage

    if (s) {
      this.config.set(atob(s))
      // TODO take the param out of the url?
      if(this.shouldSaveToLocalStorage()) {
        // also if save to local storage is checked, overwrite local storage
        // TODO is this the right thing to do here?
        // or should i make a query param called persist?
        localStorage.setItem(STORAGE_KEY, this.config());
      }
    } else {
      const val = localStorage.getItem(STORAGE_KEY);
      if (val && this.shouldSaveToLocalStorage()) {
        this.config.set(val);
      }
    }
  }
}
