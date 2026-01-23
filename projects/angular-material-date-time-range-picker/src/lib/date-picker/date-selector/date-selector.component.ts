import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal, ViewChild, computed } from '@angular/core';
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
import { formatDate } from '../until';
import { DEFAULT_TIME_RANGES, FUTURE_TIME_RANGES } from '../constants';

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
  readonly #dialogRef = inject(MatDialogRef<DateSelector>);
  readonly #data = inject(MAT_DIALOG_DATA) as DatePickerModel;
  readonly #selectionModel = inject(MatRangeDateSelectionModel<Date>);
  readonly #breakpoints = inject(BreakpointObserver);
  private _dateAdapter = inject(DateAdapter);
  private _dateFormats = inject(MAT_DATE_FORMATS);

  @ViewChild('sidenav') sidenav?: MatSidenav;

  isMobile = signal(false);

  public data = this.#data;

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
    return formatDate(new Date(startStr), this._dateAdapter, this._dateFormats);
  });

  displayEnd = computed(() => {
    const endStr = this.endDate();
    if (!endStr) return '';
    return formatDate(new Date(endStr), this._dateAdapter, this._dateFormats);
  });

  timeRanges: TimeRange[] = [...DEFAULT_TIME_RANGES];
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
        this.timeRanges = [...this.timeRanges, ...FUTURE_TIME_RANGES];
      }
    }
    
    if (!this.data?.dateTimePicker) {
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

      // 处理 startof: 前缀 (本周/本月/今年)
      if (time.startsWith('startof:')) {
        const unit = time.replace('startof:', '').trim().toLowerCase();
        const result = new Date(now);
        result.setHours(0, 0, 0, 0);

        switch (unit) {
          case 'week':
            // 假设周一为一周的开始
            const day = result.getDay() || 7; // 0是周日，改为7
            if (day !== 1) {
              result.setHours(-24 * (day - 1));
            }
            break;
          case 'month':
            result.setDate(1);
            break;
          case 'year':
            result.setMonth(0, 1);
            break;
        }
        return result;
      }

      // 处理 offset: 前缀
      if (time.startsWith('offset:')) {
        const offsetStr = time.replace('offset:', '').trim();
        if (offsetStr === 'now') return new Date(now);

        // 检查是否有 /start 或 /end 后缀
        let suffix = '';
        let cleanOffset = offsetStr;
        if (offsetStr.endsWith('/start')) {
          suffix = 'start';
          cleanOffset = offsetStr.replace('/start', '');
        } else if (offsetStr.endsWith('/end')) {
          suffix = 'end';
          cleanOffset = offsetStr.replace('/end', '');
        }

        const regex = /([+-]?)(\d+)(months?|days?|years?|weeks?|hours?|minutes?)/i;
        const match = regex.exec(cleanOffset);
        
        // 如果没有匹配到数字偏移量，但有后缀（例如 offset:0days/start），尝试解析
        // 注意：上面的正则也能匹配 0days
        
        const result = new Date(now);
        
        if (match) {
          const sign = match[1] === '-' ? -1 : 1;
          const value = parseInt(match[2], 10) * sign;
          const unit = match[3].toLowerCase();

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
        }

        // 应用后缀修正
        if (suffix === 'start') {
          result.setHours(0, 0, 0, 0);
        } else if (suffix === 'end') {
          result.setHours(23, 59, 59, 999);
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

    if (start) {
      this.startHour.set(start.getHours());
      this.startMinute.set(start.getMinutes());
    } else {
      this.startHour.set(null);
      this.startMinute.set(null);
    }

    if (end) {
      this.endHour.set(end.getHours());
      this.endMinute.set(end.getMinutes());
    } else {
      this.endHour.set(null);
      this.endMinute.set(null);
    }
  }

  rangeChanged(selectedDate: Date | null): void {
    if (!selectedDate) return;

    if (this.selectingStart) {
      // 正在选择开始日期
      let h = 0, m = 0, s = 0, ms = 0;
      // 尝试保留之前的开始时间
      if (this.selectedDateRange?.start) {
        h = this.selectedDateRange.start.getHours();
        m = this.selectedDateRange.start.getMinutes();
        s = this.selectedDateRange.start.getSeconds();
      }

      const newStart = new Date(selectedDate);
      newStart.setHours(h, m, s, ms);

      this.startDate.set(newStart.toISOString());
      this.endDate.set('');
      this.startHour.set(newStart.getHours());
      this.startMinute.set(newStart.getMinutes());
      this.endHour.set(null);
      this.endMinute.set(null);
      this.selectedTimeRange.set(undefined);
      this.selectedDateRange = new DateRange(newStart, null);
      this.#selectionModel.updateSelection(this.selectedDateRange, this);
      this.selectingStart = false;
    } else {
      // 正在选择结束日期
      const start = this.#selectionModel.selection.start;
      if (!start) return;

      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

      let newStart: Date;
      let newEnd: Date;

      if (selectedDay.getTime() < startDay.getTime()) {
        // 用户选了一个比 Start 更早的日期 -> 交换角色
        // 新 Start (selectedDate) 设为 00:00
        newStart = new Date(selectedDate);
        newStart.setHours(0, 0, 0, 0);

        // 新 End (旧 start) 设为 23:59
        newEnd = new Date(start);
        newEnd.setHours(23, 59, 59, 999);
      } else {
        // 正常顺序 (selectedDate >= start)
        // Start 保持原样
        newStart = new Date(start);

        // End (selectedDate) 设为 23:59
        newEnd = new Date(selectedDate);
        newEnd.setHours(23, 59, 59, 999);
        
        // 如果是同一天，确保 Start <= End
        if (newStart.getTime() > newEnd.getTime()) {
           newStart.setHours(0, 0, 0, 0);
        }
      }

      this.updateSelection(newStart, newEnd);
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

    const result: DateTimePickerValue = {
      start: start.toISOString(),
      end: end.toISOString()
    };

    this.data = { ...this.data, dateTimePicker: result };
    this.#dialogRef.close(this.data);
  }

  dismiss(): void {
    this.#dialogRef.close(undefined);
  }

  readonly hours = Array.from({ length: 24 }, (_, i) => i);
  readonly minutes = Array.from({ length: 60 }, (_, i) => i);

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
