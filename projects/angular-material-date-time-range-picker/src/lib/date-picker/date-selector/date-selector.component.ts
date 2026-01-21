import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  model,
  OnInit,
  output,
  signal
} from '@angular/core';
import {MatInput} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {DatePipe, NgClass} from '@angular/common';
import {SmartDialogService} from '../../shared';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {DatePickerModel, DateTimePicker, HourType, TimeRange, Weekday, WeekType} from '../interfaces';
import {TablerIconComponent, provideTablerIcons} from '@luoxiao123/angular-tabler-icons';
import {IconCheck, IconInfoCircle, IconCalendarDue, IconClock} from '@luoxiao123/angular-tabler-icons/icons';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MatCalendar,
  MatDatepickerModule,
  MatRangeDateSelectionModel
} from '@angular/material/datepicker';
import {Container} from '../components';

@Component({
  selector: 'date-time-picker-selector',
  templateUrl: './date-selector.component.html',
  styles: `:host {
    display: block;
    height: 100%;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNativeDateAdapter(),
    DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel
  ],
  imports: [
    MatCalendar, TablerIconComponent, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, FormsModule, NgClass,
    MatCheckbox, DatePipe, MatInput, MatTimepickerModule, Container
  ],
})
export class DateSelector implements OnInit {
  readonly #cdr = inject(ChangeDetectorRef);
  readonly #smartDialog = inject(SmartDialogService);
  readonly #selectionModel = inject(MatRangeDateSelectionModel<Date>);
  public data = this.#smartDialog.getData() as DatePickerModel;

  startDate = model<string>('');
  endDate = model<string>('');

  future = model<boolean>(false);
  optionalFeatures = model<boolean>(true);

  relativeDurations = [
    ['最近5分钟', '-5minutes'],
    ['最近15分钟', '-15minutes'],
    ['最近30分钟', '-30minutes'],
    ['最近1小时', '-1hours'],
    ['最近3小时', '-3hours'],
    ['最近6小时', '-6hours'],
    ['最近12小时', '-12hours'],
    ['最近24小时', '-24hours'],
    ['最近2天', '-2days'],
    ['最近7天', '-7days'],
    ['最近30天', '-30days'],
    ['最近90天', '-90days'],
    ['最近6个月', '-6months'],
    ['最近1年', '-1years'],
    ['最近2年', '-2years'],
    ['最近5年', '-5years'],
    ['上周', '-1weeks'],
    ['上个月', '-1months'],
    ['去年', '-1years']
  ];

  fixedDays = [
    ['昨天', '-1days/day'],
    ['前天', '-2days/day'],
    ['上周同一天', '-7days/day'],
    ['上周', '-1weeks/week'],
    ['上个月', '-1months/month'],
    ['去年', '-1years/year'],
  ];

  currentPeriods = [
    ['今天', 'today', 'today'],
    ['今天至今', 'today', 'now'],
    ['本周至今', 'thisweek', 'now'],
    ['本月至今', 'thismonth', 'now'],
    ['今年至今', 'thisyear', 'now']
  ];

  timeRanges = signal<TimeRange[]>([
    ...this.relativeDurations.map(([label, offset]) => ({
      label,
      start: `offset:${offset}`,
      end: 'offset:now'
    })),
    ...this.fixedDays.map(([label, point]) => ({
      label,
      start: `offset:${point}`,
      end: `offset:${point}`
    })),
    ...this.currentPeriods.map(([label, start, end]) => ({
      label,
      start: `offset:${start}`,
      end: `offset:${end}`
    }))
  ]);
  selectedTimeRange = model<TimeRange | undefined>(undefined);

  allDays = model<boolean>(true);
  weekTypes = signal<WeekType[]>([
    {label: '全部', value: 0},
    {label: '工作日', value: 1},
    {label: '自定义', value: 2},
  ]);
  selectedWeekType = model<WeekType | undefined>(this.weekTypes()[0]);
  weekdays = model<Weekday[]>([
    {label: '六', data: 'Saturday', value: 0, selected: false},
    {label: '日', data: 'Sunday', value: 1, selected: false},
    {label: '一', data: 'Monday', value: 2, selected: false},
    {label: '二', data: 'Tuesday', value: 3, selected: false},
    {label: '三', data: 'Wednesday', value: 4, selected: false},
    {label: '四', data: 'Thursday', value: 5, selected: false},
    {label: '五', data: 'Friday', value: 6, selected: false},
  ]);

  selectedWeekday = model<Weekday | undefined>();

  allHours = model<boolean>(true);
  hourTypes = signal<HourType[]>([
    {label: '全部', value: 0, selected: false},
    {label: '忙碌时间', value: 1, selected: false},
    {label: '自定义', value: 2, selected: true}
  ]);
  selectedHour = model<HourType | undefined>(this.hourTypes()[2]);

  selectedDates = output<string[]>();
  selectedDateRange!: DateRange<Date> | null;
  now = new Date();
  selectingStart = true;

  ngOnInit(): void {
    if (this.data) {
      this.optionalFeatures.set(this.data.optionalFeatures);
      this.future.set(this.data.future);

      const picker = this.data.dateTimePicker;

      if (picker) {
        if (picker.start_datetime && picker.end_datetime) {
          this.selectedDateRange = {
            start: new Date(picker.start_datetime),
            end: new Date(picker.end_datetime)
          } as DateRange<Date>;
        }

        if (Array.isArray(picker.week_days) && picker.week_days.length) {
          this.allDays.set(false);
          const selectedDays = new Set(picker.week_days.map(d => d.toLowerCase()));
          this.weekdays.update(days => days.map(day => ({...day, selected: selectedDays.has(day.data.toLowerCase())})));
        }

        if (picker.start_hour != null && picker.end_hour != null) {
          this.allHours.set(false);
          const start = this.selectedDateRange?.start;
          const end = this.selectedDateRange?.end;

          if (start && end) {
            start.setHours(picker.start_hour, picker.start_minute ?? 0, 0, 0);
            end.setHours(picker.end_hour, picker.end_minute ?? 59, 0, 0);
            this.selectedDateRange = new DateRange(start, end);
          }

          this.selectedHour.set(this.hourTypes()[2]);
        }
      }

      if (this.future()) {
        const futureOffsets: TimeRange[] = [
          {label: '未来1天', start: 'offset:now', end: 'offset:+1days'},
          {label: '未来1周', start: 'offset:now', end: 'offset:+1weeks'},
          {label: '未来1月', start: 'offset:now', end: 'offset:+1months'},
          {label: '未来3月', start: 'offset:now', end: 'offset:+3months'}
        ];
        this.timeRanges.update(ranges => [...ranges, ...futureOffsets]);
      }
    } else {
      this.selectTimeRange(this.timeRanges()[5]);
    }

    this.#cdr.detectChanges();
  }

  selectTimeRange(timeRange: TimeRange): void {
    this.selectedTimeRange.set(timeRange);
    const {startDate, endDate} = this.processTimeRange(timeRange);
    const start = new Date(startDate);
    const end = new Date(endDate);

    this.startDate.set(start.toISOString());
    this.endDate.set(end.toISOString());
    this.selectedDateRange = new DateRange<Date>(start, end);
    this.allHours.set(true);
    this.selectedHour.set(this.hourTypes()[2]);
  }

  private processTimeRange(timeRange: TimeRange): { startDate: string, endDate: string } {
    const now = new Date();
    const parseTime = (time: string): Date => {
      if (!time) return new Date(now);
      if (time.startsWith('offset:')) {
        const offset = time.replace('offset:', '').trim();
        if (offset === 'now') return new Date(now);

        const regex = /([+-]?)(\d+)(months?|days?|years?|weeks?|hours?|minutes?)/i;
        const match = regex.exec(offset);
        if (!match) return new Date(now);

        const sign = match[1] === '-' ? -1 : 1;
        const value = parseInt(match[2], 10) * sign;
        const unit = match[3].toLowerCase();
        const result = new Date(now);

        switch (unit) {
          case 'minutes':
          case 'minute':
            result.setMinutes(result.getMinutes() + value);
            break;
          case 'hours':
          case 'hour':
            result.setHours(result.getHours() + value);
            break;
          case 'days':
          case 'day':
            result.setDate(result.getDate() + value);
            break;
          case 'weeks':
          case 'week':
            result.setDate(result.getDate() + value * 7);
            break;
          case 'months':
          case 'month':
            result.setMonth(result.getMonth() + value);
            break;
          case 'years':
          case 'year':
            result.setFullYear(result.getFullYear() + value);
            break;
        }
        return result;
      }
      return new Date(time);
    };

    const startDate = timeRange.start ? parseTime(timeRange.start) : null;
    const endDate = timeRange.end ? parseTime(timeRange.end) : now;

    return {
      startDate: (startDate ?? endDate).toISOString(),
      endDate: endDate.toISOString()
    };
  }

  changeDatePart(part: 'start' | 'end', date: Date | string): void {
    if (!date) return;

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return;

    dateObj.setHours(0, 0, 0, 0);
    this.selectedTimeRange.set(undefined);

    let start = this.selectedDateRange?.start ?? null;
    let end = this.selectedDateRange?.end ?? null;

    if (part === 'start') {
      start = dateObj;
    } else {
      end = dateObj;
    }

    if (start && end && start.getTime() > end.getTime()) {
      [start, end] = [end, start];
    }

    const range = new DateRange<Date>(start, end);
    this.selectedDateRange = range;
    this.startDate.set(start?.toISOString() ?? '');
    this.endDate.set(end?.toISOString() ?? '');
  }

  submit(): void {
    const start = new Date(this.selectedDateRange?.start ?? '');
    const end = new Date(this.selectedDateRange?.end ?? '');

    const result: DateTimePicker = {
      start_datetime: start.toISOString(),
      end_datetime: end.toISOString()
    };

    if (this.data.optionalFeatures) {
      if (!this.allDays()) {
        result.week_days = this.weekdays().filter(day => day.selected).map(day => day.data);
      }

      if (!this.allHours()) {
        result.start_hour = start.getHours();
        result.start_minute = start.getMinutes();
        result.end_hour = end.getHours();
        result.end_minute = end.getMinutes();
      }
    }

    this.data = {...this.data, dateTimePicker: result};
    this.#smartDialog.close(this.data);
  }

  dismiss(): void {
    this.#smartDialog.close(undefined);
  }
}
