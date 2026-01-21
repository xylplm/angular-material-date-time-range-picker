import {Component, model, OnDestroy, OnInit, signal, computed} from '@angular/core';
import {DatePickerComponent, DateTimePicker} from '@luoxiao123/angular-material-date-time-range-picker';

@Component({
  selector: 'app-root',
  imports: [DatePickerComponent],
  templateUrl: './app.component.html'
})
export class App implements OnInit, OnDestroy {
  mediaQueryList!: MediaQueryList;
  dateTimePicker = model<DateTimePicker | undefined>();
  themes = signal<('light' | 'dark')[]>(['light', 'dark']);
  selectedTheme = signal<'light' | 'dark'>('light');
  selectedDateRange = computed(() => {
    const picker = this.dateTimePicker();
    if (!picker?.start_datetime || !picker?.end_datetime) {
      return '';
    }
    const startDate = new Date(picker.start_datetime).toLocaleDateString('zh-CN');
    const endDate = new Date(picker.end_datetime).toLocaleDateString('zh-CN');
    return `${startDate} ~ ${endDate}`;
  });

  getThemeButtonClass = (theme: 'light' | 'dark') => {
    return this.selectedTheme() === theme
      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold'
      : 'bg-stone-100 dark:bg-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-zinc-600';
  };

  ngOnInit(): void {
    const storedMode = localStorage.getItem('theme') as 'light' | 'dark';
    if (storedMode) {
      this.selectedTheme.set(storedMode);
    }

    this.changeTheme(storedMode || 'light');
  }

  selectDates(dateTimePicker: DateTimePicker | undefined): void {
    console.log('Selected date range:', dateTimePicker);
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
