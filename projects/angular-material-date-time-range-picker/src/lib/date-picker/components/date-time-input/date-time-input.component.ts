import { Component, input, output, ChangeDetectionStrategy, effect, computed, inject } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { TablerIconComponent } from '@luoxiao123/angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MatDateFormats, MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { zhCN } from 'date-fns/locale';

export class DynamicDateFormats implements MatDateFormats {
  get parse() {
    return {
      dateInput: this._format,
    };
  }
  get display() {
    return {
      dateInput: this._format,
      monthYearLabel: 'MMM yyyy',
      dateA11yLabel: 'PP',
      monthYearA11yLabel: 'MMMM yyyy',
    };
  }

  private _format = 'yyyy-MM-dd';

  setFormat(format: string) {
    this._format = format;
  }
}

@Component({
  selector: 'date-time-input',
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: zhCN },
    { provide: MAT_DATE_FORMATS, useClass: DynamicDateFormats }
  ],
  imports: [MatDatepickerModule, FormsModule, TablerIconComponent, CommonModule]
})
export class DateTimeInputComponent {
  private formats = inject(MAT_DATE_FORMATS) as DynamicDateFormats;
  private _dateAdapter = inject(DateAdapter);

  label = input<string>('');
  dateFormat = input<string>('yyyy-MM-dd');
  dateValue = input<string | null>(null);
  hourValue = input<number | null>(null);
  minuteValue = input<number | null>(null);
  hours = input<number[]>([]);
  minutes = input<number[]>([]);

  dateChange = output<string>();
  hourChange = output<number | null>();
  minuteChange = output<number | null>();
  timeChange = output<void>();

  protected dateObj = computed(() => {
    const val = this.dateValue();
    return val ? new Date(val) : null;
  });

  constructor() {
    effect(() => {
      this.formats.setFormat(this.dateFormat());
      // 强制刷新 DateAdapter 以应用新格式（如果需要）
      // 注意：通常 DateAdapter 不直接存储格式，而是使用 MAT_DATE_FORMATS
      // 但我们需要触发变更检测或通知组件格式已更改
      // 这里我们通过重新设置 locale 来触发 DateAdapter 的流更新，或者仅仅依赖 Angular 的变更检测
      // 由于 MatDatepicker 输入框的格式化是在渲染时发生的，只要 formats 变了，下次变更检测应该会更新
      // 但为了确保立即生效，我们可以尝试触发一次变更
      this._dateAdapter.setLocale(zhCN); 
    });
  }

  onDateChange(value: Date | null) {
    if (value) {
      this.dateChange.emit(value.toISOString());
    }
  }

  onHourChange(value: number | null) {
    this.hourChange.emit(value);
    this.timeChange.emit();
  }

  onMinuteChange(value: number | null) {
    this.minuteChange.emit(value);
    this.timeChange.emit();
  }
}
