import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, model, OnInit, signal, ViewChild, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModel, DateTimePickerValue, TimeRange } from '../interfaces';
import { TablerIconComponent } from '@luoxiao123/angular-tabler-icons';
import { DateRange, DefaultMatCalendarRangeStrategy, MatCalendar, MatDatepickerModule, MatRangeDateSelectionModel } from '@angular/material/datepicker';
import { Container } from '../components';
import { DateTimeInputComponent } from '../components';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'date-time-picker-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DefaultMatCalendarRangeStrategy,
    MatRangeDateSelectionModel
  ],
  imports: [
    MatCalendar,
    TablerIconComponent,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    Container,
    DateTimeInputComponent,
    MatSidenavModule,
    MatButtonModule
  ]
})
export class DateSelector implements OnInit {
  readonly #cdr = inject(ChangeDetectorRef);
  readonly #dialogRef = inject(MatDialogRef<DateSelector>);
  readonly #data = inject(MAT_DIALOG_DATA) as DatePickerModel;
  readonly #selectionModel = inject(MatRangeDateSelectionModel<Date>);
  readonly #breakpoints = inject(BreakpointObserver);
  private _dateAdapter = inject(DateAdapter);
  private _dateFormats = inject(MAT_DATE_FORMATS);

  @ViewChild('sidenav') sidenav?: MatSidenav;

  isMobile = signal(false);

  public data = this.#data;

  valueFormat = this.data?.valueFormat ?? 'yyyy-MM-dd HH:mm';

  startDate = model<string>('');
  endDate = model<string>('');

  startHour = model<number | null>(null);
  startMinute = model<number | null>(null);
  endHour = model<number | null>(null);
  endMinute = model<number | null>(null);

  future = model<boolean>(false);

  displayStart = computed(() => {
    const startStr = this.startDate();
    if (!startStr) return '';
    return this.formatDate(new Date(startStr));
  });

  displayEnd = computed(() => {
    const endStr = this.endDate();
    if (!endStr) return '';
    return this.formatDate(new Date(endStr));
  });

  private formatDate(date: Date): string {
    const datePart = this._dateAdapter.format(date, this._dateFormats.display.dateInput);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${datePart} ${hours}:${minutes}`;
  }

  timeRanges: TimeRange[] = [
    { label: '最近5分钟', start: 'offset:-5minutes', end: 'offset:now' },
    { label: '最近15分钟', start: 'offset:-15minutes', end: 'offset:now' },
    { label: '最近30分钟', start: 'offset:-30minutes', end: 'offset:now' },
    { label: '最近1小时', start: 'offset:-1hours', end: 'offset:now' },
    { label: '最近3小时', start: 'offset:-3hours', end: 'offset:now' },
    { label: '最近6小时', start: 'offset:-6hours', end: 'offset:now' },
    { label: '最近12小时', start: 'offset:-12hours', end: 'offset:now' },
    { label: '最近24小时', start: 'offset:-24hours', end: 'offset:now' },
    { label: '最近2天', start: 'offset:-2days', end: 'offset:now' },
    { label: '最近7天', start: 'offset:-7days', end: 'offset:now' },
    { label: '最近30天', start: 'offset:-30days', end: 'offset:now' },
    { label: '最近90天', start: 'offset:-90days', end: 'offset:now' },
    { label: '最近6个月', start: 'offset:-6months', end: 'offset:now' },
    { label: '最近1年', start: 'offset:-1years', end: 'offset:now' },
    { label: '最近2年', start: 'offset:-2years', end: 'offset:now' },
    { label: '最近5年', start: 'offset:-5years', end: 'offset:now' },
    { label: '昨天', start: 'offset:-1days/day', end: 'offset:-1days/day' },
    { label: '前天', start: 'offset:-2days/day', end: 'offset:-2days/day' },
    { label: '上周同一天', start: 'offset:-7days/day', end: 'offset:-7days/day' },
    { label: '今天', start: 'offset:today', end: 'offset:today' },
    { label: '今天至今', start: 'offset:today', end: 'offset:now' },
    { label: '本周至今', start: 'offset:thisweek', end: 'offset:now' },
    { label: '本月至今', start: 'offset:thismonth', end: 'offset:now' },
    { label: '今年至今', start: 'offset:thisyear', end: 'offset:now' }
  ];
  selectedTimeRange = model<TimeRange | undefined>(undefined);

  selectedDateRange: DateRange<Date> | null = null;
  now = new Date();
  selectingStart = true;

  constructor() {
    this.#breakpoints
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
  }

  ngOnInit(): void {
    if (this.data) {
      this.future.set(this.data.future);

      const picker = this.data.dateTimePicker;

      if (picker) {
        if (picker.start && picker.end) {
          const start = new Date(picker.start);
          const end = new Date(picker.end);
          this.selectedDateRange = new DateRange(start, end);

          this.#selectionModel.updateSelection(this.selectedDateRange, this);

          // 初始化时间值
          this.startDate.set(picker.start);
          this.endDate.set(picker.end);
          this.startHour.set(start.getHours());
          this.startMinute.set(start.getMinutes());
          this.endHour.set(end.getHours());
          this.endMinute.set(end.getMinutes());
        }
      }

      if (this.future()) {
        const futureOffsets: TimeRange[] = [
          { label: '未来1天', start: 'offset:now', end: 'offset:+1days' },
          { label: '未来1周', start: 'offset:now', end: 'offset:+1weeks' },
          { label: '未来1月', start: 'offset:now', end: 'offset:+1months' },
          { label: '未来3月', start: 'offset:now', end: 'offset:+3months' }
        ];
        this.timeRanges = [...this.timeRanges, ...futureOffsets];
      }
    } else {
      this.selectTimeRange(this.timeRanges[5]);
    }
  }

  selectTimeRange(timeRange: TimeRange): void {
    this.selectedTimeRange.set(timeRange);
    const { startDate, endDate } = this.processTimeRange(timeRange);
    const start = new Date(startDate);
    const end = new Date(endDate);

    this.startDate.set(start.toISOString());
    this.endDate.set(end.toISOString());
    this.startHour.set(start.getHours());
    this.startMinute.set(start.getMinutes());
    this.endHour.set(end.getHours());
    this.endMinute.set(end.getMinutes());
    this.selectedDateRange = new DateRange<Date>(start, end);
  }

  private processTimeRange(timeRange: TimeRange): { startDate: string; endDate: string } {
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

    let dateObj: Date;

    if (typeof date === 'string') {
      // 如果是字符串，尝试解析它
      dateObj = new Date(date);
      // 如果不能解析为有效日期，返回
      if (isNaN(dateObj.getTime())) return;
    } else {
      dateObj = new Date(date);
    }

    // 保持原有的时间部分（只修改日期部分）
    if (part === 'start') {
      const currentStart = this.selectedDateRange?.start;
      if (currentStart) {
        dateObj.setHours(currentStart.getHours(), currentStart.getMinutes(), currentStart.getSeconds());
      } else {
        dateObj.setHours(0, 0, 0, 0);
      }
    } else {
      const currentEnd = this.selectedDateRange?.end;
      if (currentEnd) {
        dateObj.setHours(currentEnd.getHours(), currentEnd.getMinutes(), currentEnd.getSeconds());
      } else {
        dateObj.setHours(0, 0, 0, 0);
      }
    }

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

  rangeChanged(selectedDate: Date | null): void {
    if (!selectedDate) return;
    
    // 创建一个新日期对象，保留日期部分，但使用当前时间作为时间部分
    const now = new Date();
    const dateWithCurrentTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );

    if (this.selectingStart) {
      this.startDate.set(dateWithCurrentTime.toISOString());
      this.endDate.set('');
      this.startHour.set(dateWithCurrentTime.getHours());
      this.startMinute.set(dateWithCurrentTime.getMinutes());
      this.endHour.set(null);
      this.endMinute.set(null);
      this.selectedTimeRange.set(undefined);
      this.selectedDateRange = new DateRange(dateWithCurrentTime, null);
      this.#selectionModel.updateSelection(this.selectedDateRange, this);
      this.selectingStart = false;
    } else {
      const start = this.#selectionModel.selection.start;
      if (!start) return;

      const range =
        start.toDateString() === selectedDate.toDateString()
          ? new DateRange(start, start)
          : new DateRange(start < dateWithCurrentTime ? start : dateWithCurrentTime, start < dateWithCurrentTime ? dateWithCurrentTime : start);

      this.updateSelection(range.start, range.end);
      this.selectingStart = true;
    }
  }

  updateSelection(start: Date, end: Date): void {
    const range = new DateRange(start, end);
    this.selectedDateRange = range;
    this.#selectionModel.updateSelection(range, this);
    this.startDate.set(start.toISOString());
    this.endDate.set(end.toISOString());
    this.startHour.set(start.getHours());
    this.startMinute.set(start.getMinutes());
    this.endHour.set(end.getHours());
    this.endMinute.set(end.getMinutes());
  }

  submit(): void {
    if (!this.selectedDateRange?.start || !this.selectedDateRange?.end) {
      return;
    }

    const start = new Date(this.selectedDateRange.start);
    const end = new Date(this.selectedDateRange.end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return;
    }

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    const result: DateTimePickerValue = {
      start: startISO,
      end: endISO
    };

    this.data = { ...this.data, dateTimePicker: result };
    this.#dialogRef.close(this.data);
  }

  dismiss(): void {
    this.#dialogRef.close(undefined);
  }

  getHours(): number[] {
    return Array.from({ length: 24 }, (_, i) => i);
  }

  getMinutes(): number[] {
    return Array.from({ length: 60 }, (_, i) => i);
  }

  updateStartTime(): void {
    if (this.selectedDateRange?.start && this.startHour() !== null && this.startMinute() !== null) {
      const startDate = new Date(this.selectedDateRange.start);
      startDate.setHours(this.startHour() ?? 0, this.startMinute() ?? 0, 0, 0);

      let endDate = this.selectedDateRange.end;
      const range = new DateRange(startDate, endDate);
      this.selectedDateRange = range;
      this.#selectionModel.updateSelection(range, this);
      this.startDate.set(startDate.toISOString());
    }
  }

  updateEndTime(): void {
    if (this.selectedDateRange?.end && this.endHour() !== null && this.endMinute() !== null) {
      const endDate = new Date(this.selectedDateRange.end);
      endDate.setHours(this.endHour() ?? 0, this.endMinute() ?? 0, 0, 0);

      let startDate = this.selectedDateRange.start;
      const range = new DateRange(startDate, endDate);
      this.selectedDateRange = range;
      this.#selectionModel.updateSelection(range, this);
      this.endDate.set(endDate.toISOString());
    }
  }
}
