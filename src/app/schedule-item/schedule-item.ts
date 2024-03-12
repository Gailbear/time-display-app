import { DateTime, Duration } from 'luxon';

export interface ScheduleItem {
  title: string;
  startTime: DateTime;
  duration: Duration;
  color: string;
}