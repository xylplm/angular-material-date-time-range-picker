import { Component, model, OnInit, signal, computed, effect, inject } from '@angular/core';
import { DatePickerComponent, DateTimePickerValue } from '@luoxiao123/angular-material-date-time-range-picker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { zhCN } from 'date-fns/locale';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-root',
  imports: [DatePickerComponent, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: zhCN },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class App implements OnInit {
  readonly #document = inject(DOCUMENT);
  readonly #builder = inject(FormBuilder);

  dateTimePicker = model<DateTimePickerValue | undefined>();
  dateTimePickerValue = signal<DateTimePickerValue | undefined>(undefined);
  themes = signal<('light' | 'dark')[]>(['light', 'dark']);
  selectedTheme = signal<'light' | 'dark'>('light');
  dateRangeForm!: FormGroup;

  selectedDateRange = computed(() => {
    const picker = this.dateTimePicker();
    if (!picker?.start || !picker?.end) {
      return '';
    }
    // 将字符串转换为Date对象以进行格式化
    const startDate = new Date(picker.start).toLocaleDateString('zh-CN');
    const endDate = new Date(picker.end).toLocaleDateString('zh-CN');
    return `${startDate} ~ ${endDate}`;
  });

  selectedDateRangeFormField = computed(() => {
    const picker = this.dateTimePickerValue();
    if (!picker?.start || !picker?.end) {
      return '';
    }
    // 将字符串转换为Date对象以进行格式化
    const startDate = new Date(picker.start).toLocaleDateString('zh-CN');
    const endDate = new Date(picker.end).toLocaleDateString('zh-CN');
    return `${startDate} ~ ${endDate}`;
  });

  constructor() {
    // 当主题变化时，自动更新 DOM 和 localStorage
    effect(() => {
      const theme = this.selectedTheme();
      this.#applyTheme(theme);
    });
  }

  ngOnInit(): void {
    this.dateRangeForm = this.#builder.group({
      dateRange: [null, Validators.required]
    });

    // 从 localStorage 恢复主题设置
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      this.selectedTheme.set(storedTheme);
    }
  }

  selectDates(dateTimePicker: DateTimePickerValue | undefined | null): void {
    console.log('Selected date range:', dateTimePicker);
  }

  onDateRangeSelected(dateTimePicker: DateTimePickerValue | undefined | null): void {
    this.dateTimePickerValue.set(dateTimePicker || undefined);
    
    if (dateTimePicker) {
      this.dateRangeForm.patchValue({
        dateRange: dateTimePicker
      });
      this.dateRangeForm.get('dateRange')?.markAsTouched();
      console.log('Form value updated:', dateTimePicker);
    }
  }

  /**
   * 填充昨天到现在的日期时间范围
   */
  fillWithYesterdayToNow(): void {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 1);

    const value: DateTimePickerValue = {
      start: start.toISOString(),
      end: end.toISOString()
    };

    this.dateRangeForm.patchValue({
      dateRange: value
    });
    this.dateTimePickerValue.set(value);
  }

  resetForm(): void {
    this.dateRangeForm.reset();
    this.dateTimePickerValue.set(undefined);
  }

  enableControl(): void {
    this.dateRangeForm.get('dateRange')?.enable();
  }

  disableControl(): void {
    this.dateRangeForm.get('dateRange')?.disable();
  }

  triggerValidation() {
    this.dateRangeForm.markAllAsTouched();
    this.dateRangeForm.updateValueAndValidity();
  }

  /**
   * 应用主题到 DOM 和 localStorage
   * 遵循 Material 标准的 CSS class 切换方式
   */
  #applyTheme(theme: 'light' | 'dark'): void {
    const htmlElement = this.#document.documentElement;

    // 移除旧的主题类，应用新的主题类
    htmlElement.classList.toggle('dark', theme === 'dark');

    // 保存主题偏好到 localStorage
    localStorage.setItem('theme', theme);
  }
}