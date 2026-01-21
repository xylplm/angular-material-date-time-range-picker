import {Component, model, OnDestroy, OnInit, signal, computed} from '@angular/core';
import {DatePickerComponent, DateTimePickerValue} from '@luoxiao123/angular-material-date-time-range-picker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [DatePickerComponent, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html'
})
export class App implements OnInit, OnDestroy {
  mediaQueryList!: MediaQueryList;
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
    const startDate = new Date(picker.start).toLocaleDateString('zh-CN');
    const endDate = new Date(picker.end).toLocaleDateString('zh-CN');
    return `${startDate} ~ ${endDate}`;
  });

  selectedDateRangeFormField = computed(() => {
    const picker = this.dateRangeForm?.get('dateRange')?.value;
    if (!picker?.start || !picker?.end) {
      return '';
    }
    const startDate = new Date(picker.start).toLocaleDateString('zh-CN');
    const endDate = new Date(picker.end).toLocaleDateString('zh-CN');
    return `${startDate} ~ ${endDate}`;
  });

  getThemeButtonClass = (theme: 'light' | 'dark') => {
    return this.selectedTheme() === theme
      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30'
      : 'bg-stone-50 dark:bg-zinc-700 text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-zinc-600';
  };

  ngOnInit(): void {
    this.dateRangeForm = new FormBuilder().group({
      dateRange: [null, Validators.required]
    });

    const storedMode = localStorage.getItem('theme') as 'light' | 'dark';
    if (storedMode) {
      this.selectedTheme.set(storedMode);
    }

    this.changeTheme(storedMode || 'light');
  }

  selectDates(dateTimePicker: DateTimePickerValue | undefined | null): void {
    console.log('Selected date range:', dateTimePicker);
  }

  onDateRangeSelected(dateTimePicker: DateTimePickerValue | undefined | null): void {
    if (dateTimePicker) {
      this.dateTimePickerValue.set(dateTimePicker);
      // 更新表单值
      this.dateRangeForm.patchValue({
        dateRange: dateTimePicker
      });
      // 标记字段为已触及以昺示验证错误
      this.dateRangeForm.get('dateRange')?.markAsTouched();
      console.log('Form value updated:', dateTimePicker);
    }
  }

  changeTheme(theme: 'light' | 'dark'): void {
    this.selectedTheme.set(theme);

    if (this.mediaQueryList) {
      this.mediaQueryList.removeEventListener('change', this.handleSystemChange);
    }

    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }

  handleSystemChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  ngOnDestroy() {
    if (this.mediaQueryList) {
      this.mediaQueryList.removeEventListener('change', this.handleSystemChange);
    }
  }
}
