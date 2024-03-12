import { Injectable } from '@angular/core';
import { DateTime, Duration, Interval } from 'luxon';
import peggy from 'peggy';
import { ScheduleItem } from '../schedule-item/schedule-item';
import { Schedule } from '../schedule/schedule';

const grammar = `
Schedule = date:Date items:Item+ end:End { return {date, items, end}}
Date "date" = _ year:Year DASH month:Month DASH day:Day EOL { return {year, month, day}}
Item "item" = _ time:Time color:Color? title:Description EOL { return {time, title: title.trim(), color}}
End "end time" = _ END time:Time { return {time}}

Time "time" = hour:$([0-2]? [0-9]) COLON minute:$([0-5] [0-9]) { return {hour: parseInt(hour), minute: parseInt(minute)}}
Day "day" = [0-3] [0-9] { return parseInt(text()) }
Month "month" = [0-1] [0-9] { return parseInt(text()) }
Year "year" = "20" [0-9] [0-9] { return parseInt(text()) }
Description "description" = @$(!EOL .)+
Color = _ LSQUARE @$(!RSQUARE .)+ RSQUARE

COLON "colon" = ":"
END "end" = "end" _
DASH "dash" = "-"
LSQUARE = "["
RSQUARE = "]"

EOL "EOL" = [\\n\\r]

_ "whitespace" = [ \t]*
`;
interface ParserOutput {
  date: ParsedTime;
  items: ParsedItem[];
  end: ParsedItem;
}

interface ParsedTime {
  hours?: number;
  minutes?: number;
  year?: number;
  month?: number;
  day?: number;
}

interface ParsedItem {
  time: ParsedTime;
  title: string;
  color?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  private parser;

  constructor() {
    this.parser = peggy.generate(grammar);
  }

  parse(input: string): Schedule {
    return this.postProcess(this.parser.parse(input));
  }

  private postProcess(output: ParserOutput): Schedule {
    const pass1 = output.items.map((item) => ({
      ...item,
      start: DateTime.fromObject({ ...item.time, ...output.date }),
    }));
    const end = DateTime.fromObject({ ...output.end.time, ...output.date });
    const length = pass1.length;
    const last = pass1.slice(-1)[0];
    const rest = pass1.slice(0, -1);
    const pass2 = rest.reduceRight<ScheduleItem[]>(
      (p, c, i) => {
        console.log(p, c);
        return [
          ...p,
          {
            title: c.title,
            duration: Interval.fromDateTimes(
              c.start,
              p.slice(-1)[0].startTime
            ).toDuration(),
            startTime: c.start,
            color: c.color ?? this.colorGenerator(length, i),
          },
        ];
      },
      [
        {
          title: last.title,
          startTime: last.start,
          duration: Interval.fromDateTimes(last.start, end).toDuration(),
          color: last.color ?? this.colorGenerator(length, length - 1),
        },
      ]
    );
    pass2.reverse();
    console.log(pass2);
    return pass2;
  }

  colorGenerator(length: number, i: number) {
    const hue = (360 / length) * i;
    return `hsl(${hue},95%,70%)`;
  }
}
