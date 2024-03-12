import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { ScheduleComponent } from './app/schedule/schedule.component';
import { ParserService } from './app/services/parser.service';
import { CommonModule } from '@angular/common';
import { ScheduleService } from './app/services/schedule.service';
import { ConfigComponent } from './app/config/config.component';
import { DemoService } from './app/services/demo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ScheduleComponent, CommonModule, ConfigComponent],
  providers: [ParserService],
  template: `
    <div class="styling">
      <h2 class="dates">
        <span>{{ schedule.date() | date}}</span>
        <span>{{ schedule.hdate() }}</span>
      </h2>
    <app-schedule [schedule]="schedule.items()"></app-schedule>
</div>
<app-config></app-config>
  `,
  styles: `
.styling {
  max-width: 600px;
  margin: 0 auto;
}

.dates {
  display: flex;
  justify-content: space-between;
}
  `,
})
export class App implements OnInit {
  constructor(public schedule: ScheduleService, private demoService: DemoService) {}
  ngOnInit() {
    this.schedule.init();
    this.demoService.makeDemoData();
  }
}

bootstrapApplication(App);
