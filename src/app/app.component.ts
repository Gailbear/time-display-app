import { CommonModule } from "@angular/common";
import { Component, OnInit, input } from "@angular/core";
import { ConfigComponent } from "./config/config.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { ParserService } from "./services/parser.service";
import { ScheduleService } from "./services/schedule.service";

@Component({
    selector: 'time-display-app',
    standalone: true,
    imports: [ScheduleComponent, CommonModule, ConfigComponent],
    providers: [ParserService, ScheduleService],
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
export class AppComponent implements OnInit {
  s = input<string>();

  constructor(public schedule: ScheduleService) {}
  ngOnInit() {
    this.schedule.init(this.s());
  }
}