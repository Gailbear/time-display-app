import { Injectable } from '@angular/core';
import { DateTime, Duration, Interval } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class DemoService {
  demoColors = [
    "tomato",
    "orange",
    "gold",
    "lightgreen",
    "cornflowerblue",
    "mediumpurple",
    "white"
  ]

  demoStartTimes = [
    -50,
    -10,
    30,
    40,
    70,
    100,
    125,
    130
  ]
  constructor() { }

  makeDemoData() {
    const now = DateTime.now()
    const startTimes = this.demoStartTimes.map(dur => {
      if (dur < 0) {
        return Interval.before(now, Duration.fromObject({minutes: dur * -1})).start as DateTime;
      } else {
        return Interval.after(now, Duration.fromObject({minutes: dur})).end as DateTime;
      }
    })
    const dateLine = now.toFormat("yyyy-MM-dd")
    const endLine = `end ${startTimes.at(-1)?.toFormat('T')}`
    const itemLines = this.demoColors.map((color, i) => this.makeDemoItem(i, startTimes[i], color))
    const data = [dateLine, ...itemLines, endLine].join('\n')
    console.log(data);
    return data;
  }

  makeDemoItem(i: number, startTime: DateTime, color: string) {
    return `${startTime.toFormat('T')} [${color}] Item ${i+1}`
  }
}
