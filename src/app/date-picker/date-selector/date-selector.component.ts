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
import {SmartDialogService} from '../../smart-dialog';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {DatePickerModel, DateTimePicker, HourType, TimeRange, Weekday, WeekType} from '../interfaces/datepicker';
import {
  featherArrowRight,
  featherCalendar,
  featherCheck,
  featherClock,
  featherInfo,
  featherX
} from '@ng-icons/feather-icons';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MatCalendar,
  MatDatepickerModule,
  MatRangeDateSelectionModel
} from '@angular/material/datepicker';
import { Container } from '../container';

@Component({
  selector: 'date-selector',
  templateUrl: './date-selector.component.html',
  styles: `:host {
    display: block;
    height: 100%;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNativeDateAdapter(),
    provideIcons({featherCheck, featherArrowRight, featherX, featherClock, featherInfo, featherCalendar}),
    DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel
  ],
  imports: [
    MatCalendar, NgIcon, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, FormsModule, NgClass,
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
      const picker = this.data.dateTimePicker;

      if (picker) {
        // 初始化日期范围
        if (picker.start_datetime && picker.end_datetime) {
          this.selectedDateRange = {
            start: new Date(picker.start_datetime),
            end: new Date(picker.end_datetime)
          } as DateRange<Date>;
          this.initializeRange();
        }

        // 初始化星期几
        if (Array.isArray(picker.week_days) && picker.week_days.length) {
          this.initializeWeekdays(picker.week_days);
        }

        // 如果指定了开始/结束，也将间隔设置到日历
        if (this.selectedDateRange?.start && this.selectedDateRange?.end) {
          this.updateSelection(this.selectedDateRange.start, this.selectedDateRange.end);
        } else if (this.selectedDateRange?.start) {
          this.rangeChanged(this.selectedDateRange.start);
        }

        // 初始化小时间隔
        if (picker.start_hour != null && picker.end_hour != null) {
          this.allHours.set(false);

          const start = this.selectedDateRange?.start;
          const end = this.selectedDateRange?.end;

          const startMinute = picker.start_minute ?? 0;
          const endMinute = picker.end_minute ?? 59;

          if (start && end) {
            start.setHours(picker.start_hour, startMinute, 0, 0);
            end.setHours(picker.end_hour, endMinute, 0, 0);
            this.selectedDateRange = new DateRange(start, end);
          }

          let active = 2;
          if (picker.start_hour === 0 && startMinute === 0 && picker.end_hour === 23 && endMinute === 59) {
            active = 0;
          } else if (picker.start_hour === 20 && startMinute === 0 && picker.end_hour === 23 && endMinute === 59) {
            active = 1;
          }

          this.selectedHour.set(this.hourTypes()[active]);
          this.hourTypes.update(types => types.map(type => ({
            ...type,
            selected: type.value === active
          })));
        }
      }

      this.optionalFeatures.set(this.data.optionalFeatures);
      this.future.set(this.data.future);

      // 如果启用未来，添加未来范围
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
      // 默认模式：选择一个预定义范围
      this.selectTimeRange(this.timeRanges()[5]);
    }

    this.#cdr.detectChanges();
  }

  initializeRange(): void {
    const start = this.selectedDateRange?.start;
    const end = this.selectedDateRange?.end;

    if (!start || !end) return;

    const now = new Date();
    const diffMinutes = Math.round((now.getTime() - start.getTime()) / 60000);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffMinutes / 1440);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    const possibleOffsets = [
      `offset:-${diffMinutes}minutes`,
      `offset:-${diffHours}hours`,
      `offset:-${diffDays}days`,
      `offset:-${diffMonths}months`,
      `offset:-${diffYears}years`
    ];

    for (const offset of possibleOffsets) {
      const matched = this.timeRanges().find(r => r.start === offset && r.end === 'offset:now');
      if (matched) {
        this.selectedTimeRange.set(matched);
        break;
      }
    }

    this.startDate.set(start.toISOString());
    this.endDate.set(end.toISOString());
  }

  initializeWeekdays(weekdays: string[]): void {
    this.allDays.set(false);

    const selectedDays = new Set(weekdays.map(d => d.toLowerCase()));
    this.weekdays.update(days => days.map(day => ({...day, selected: selectedDays.has(day.data.toLowerCase())})));

    const all = new Set(this.weekdays().map(d => d.data.toLowerCase()));
    const working = new Set(['saturday', 'sunday', 'monday', 'tuesday', 'wednesday']);

    const isAll = selectedDays.size === all.size;
    const isWorking = selectedDays.size === working.size && [...working].every(day => selectedDays.has(day));

    const label = isAll ? 'ALL' : isWorking ? 'WORKING DAYS' : 'CUSTOM';
    this.selectedWeekType.set(this.weekTypes().find(w => w.label === label));
  }

  rangeChanged(selectedDate: Date | null): void {
    if (!selectedDate) return;

    if (this.selectingStart) {
      this.startDate.set(selectedDate.toISOString());
      this.endDate.set('');
      this.selectedTimeRange.set(undefined);

      this.selectedDateRange = null;
      this.#selectionModel.updateSelection(new DateRange(selectedDate, null), this);
      this.selectingStart = false;
    } else {
      const start = this.#selectionModel.selection.start;
      if (!start) return;

      const range = start.toDateString() === selectedDate.toDateString()
        ? new DateRange(start, start)
        : new DateRange(start < selectedDate ? start : selectedDate, start < selectedDate ? selectedDate : start);

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

    this.selectedHour.set(this.hourTypes()[2]);
  }

  selectTimeRange(timeRange: TimeRange): void {
    const currentTimeRange = this.selectedTimeRange();

    if (currentTimeRange?.start === timeRange.start && currentTimeRange?.end === timeRange.end) {
      this.selectedTimeRange.set(undefined);

      this.startDate.set('');
      this.endDate.set('');
      this.selectedDateRange = null; // 重置选定的范围
    } else {
      this.selectedTimeRange.set(timeRange);

      const {startDate, endDate} = this.processTimeRange(timeRange);
      const start = new Date(startDate);
      const end = new Date(endDate);

      // 两个日期时间的ISO格式，包括时间和时区
      this.startDate.set(start.toISOString());
      this.endDate.set(end.toISOString());
      this.selectedDateRange = new DateRange<Date>(start, end); // 更新日历范围
    }

    this.allHours.set(true);
    this.selectedHour.set(this.hourTypes()[2]);
  }

  processTimeRange(timeRange: TimeRange): { startDate: string, endDate: string } {
    const now = new Date();
    const parseTime = (time: string): Date => {
      if (!time) return new Date(now);

      if (time.startsWith('offset:')) {
        const offset = time.replace('offset:', '').trim();

        if (offset === 'now') return new Date(now);
        if (offset === 'today') {
          return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        if (offset === 'thisweek') {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          return startOfWeek;
        }
        if (offset === 'thismonth') {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          startOfMonth.setHours(0, 0, 0, 0);
          return startOfMonth;
        }
        if (offset === 'thisyear') {
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          startOfYear.setHours(0, 0, 0, 0);
          return startOfYear;
        }

        // 处理相对偏移，如+1days或-6months
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

  changeWeekType(type: WeekType): void {
    this.selectedWeekType.set(type);

    this.weekdays.update(items =>
      items.map(item => {
        // 如果选择自定义，取消选择所有天
        // 如果选择工作日，选择除周四和周五外的所有天
        // 如果选择全部，选择所有天
        const shouldSelect = type.value === 0 ? true : type.value === 1 ? ![5, 6].includes(item.value) : false;

        return {...item, selected: shouldSelect};
      })
    );
  }

  changeWeekdays(type: Weekday): void {
    this.weekdays.update(items => {
      // 切换点击的星期的选中状态
      const updatedItems = items.map(item =>
        item.value === type.value ? {...item, selected: !type.selected} : item
      );

      // 检查是否所有星期都被选中
      const areAllSelected = updatedItems.every(item => item.selected);

      if (areAllSelected) {
        // 如果全部选中，设置第一个星期类型并取消选择所有
        this.selectedWeekType.set(this.weekTypes()[0]);
        // return updatedItems.map(item => ({...item, selected: false}));
      } else {
        // 否则，设置最后一个星期类型
        this.selectedWeekType.set(this.weekTypes()[this.weekTypes().length - 1]);
      }

      return updatedItems;
    });
  }

  applyHourPreset(hourType: HourType): void {
    if (hourType.value === 2) return;

    this.selectedTimeRange.set(undefined);
    this.selectedHour.set(hourType);

    const getTime = (value: number) => {
      switch (value) {
        case 0:
          return {start: [0, 0], end: [23, 59]}; // 全部
        case 1:
          return {start: [20, 0], end: [23, 59]}; // 忙碌
        default:
          return null; // 自定义
      }
    };

    const times = getTime(hourType.value);
    if (!times || !this.selectedDateRange?.start || !this.selectedDateRange?.end) return;

    const [startHour, startMin] = times.start;
    const [endHour, endMin] = times.end;

    const start = new Date(this.selectedDateRange.start);
    const end = new Date(this.selectedDateRange.end);

    start.setHours(startHour, startMin, 0, 0);
    end.setHours(endHour, endMin, 0, 0);

    this.selectedDateRange = new DateRange<Date>(start, end);
    this.#selectionModel.updateSelection(this.selectedDateRange, this);
    this.startDate.set(start.toISOString());
    this.endDate.set(end.toISOString());
  }

  changeDatePart(part: 'start' | 'end', date: Date, isTime = false): void {
    if (!date || isNaN(date.getTime())) return;

    if (!isTime) {
      date.setHours(0, 0, 0, 0);
    } else {
      this.selectedHour.set(this.hourTypes()[2]);
    }

    this.selectedTimeRange.set(undefined);

    let start = this.selectedDateRange?.start ?? null;
    let end = this.selectedDateRange?.end ?? null;

    if (part === 'start') {
      start = date;
    } else {
      end = date;
    }

    if (start && end && start.getTime() > end.getTime()) {
      [start, end] = [end, start];
    }

    const range = new DateRange<Date>(start, end);
    this.selectedDateRange = range;
    this.#selectionModel.updateSelection(range, this);

    this.startDate.set(start?.toISOString() ?? '');
    this.endDate.set(end?.toISOString() ?? '');
  }

  getSelectedWeekDays(): string[] {
    return this.weekdays().filter(day => day.selected).map(day => day.data);
  }

  getHourRange(): { startHour: number; startMinute: number; endHour: number; endMinute: number } {
    const start = this.selectedDateRange?.start;
    const end = this.selectedDateRange?.end;

    return {
      startHour: start?.getHours() ?? 0,
      startMinute: start?.getMinutes() ?? 0,
      endHour: end?.getHours() ?? 0,
      endMinute: end?.getMinutes() ?? 0
    };
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
        result.week_days = this.getSelectedWeekDays();
      }

      if (!this.allHours()) {
        const {startHour, startMinute, endHour, endMinute} = this.getHourRange();

        start.setHours(startHour, startMinute, 0, 0);
        end.setHours(endHour, endMinute, 0, 0);

        result.start_hour = startHour;
        result.start_minute = startMinute;
        result.end_hour = endHour;
        result.end_minute = endMinute;
        result.start_datetime = start.toISOString();
        result.end_datetime = end.toISOString();
      }
    }

    this.data = {...this.data, dateTimePicker: result};

    this.dismiss();
  }

  dismiss(): void {
    this.#smartDialog.close(this.data);
  }
}
