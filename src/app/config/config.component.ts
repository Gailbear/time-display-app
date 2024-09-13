import { CommonModule } from '@angular/common';
import {
  Component,
  WritableSignal,
  signal,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleService } from '../services/schedule.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
})
export class ConfigComponent implements OnInit, OnDestroy {
  open: WritableSignal<boolean> = signal(false);
  linkOpen: WritableSignal<boolean> = signal(false);
  btnText: WritableSignal<string> = signal('Configure');

  configControl = new FormControl('');
  localStorageControl = new FormControl(true);
  linkControl = new FormControl('');
  subscriptions = new Subscription();

  constructor(private schedule: ScheduleService) {
    effect(() => {
      this.configControl.setValue(this.schedule.config());
    });
    effect(() => {
      this.localStorageControl.setValue(
        this.schedule.shouldSaveToLocalStorage()
      );
    });
  }

  ngOnInit() {
    this.subscriptions.add(
      this.configControl.valueChanges.subscribe((newVal) => {
        this.schedule.config.set(newVal ?? '');
      })
    );
    this.subscriptions.add(
      this.localStorageControl.valueChanges.subscribe((newVal) => {
        this.schedule.shouldSaveToLocalStorage.set(newVal ?? false);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleConfig() {
    this.open.set(!this.open());
  }

  getLink() {
    this.linkOpen.set(!this.linkOpen());
    if(this.linkOpen()) {
      this.linkControl.setValue(this.schedule.getLink());
    }
  }
}
