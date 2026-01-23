import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, model, output, signal, ViewChild, ElementRef, Input, forwardRef, computed, Injector, untracked } from '@angular/core';
import { take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateRange, MatDatepickerModule } from '@angular/material/datepicker';
import { DatePickerModel, DateTimePickerValue } from './interfaces';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TablerIconComponent, provideTablerIcons } from '@luoxiao123/angular-tabler-icons';
import { IconCalendarDue, IconX } from '@luoxiao123/angular-tabler-icons/icons';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { DateSelector } from './date-selector/date-selector.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate } from './until';

@Component({
  selector: 'date-time-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TablerIconComponent, MatDatepickerModule, MatDialogModule],
  providers: [
    provideTablerIcons({ IconCalendarDue, IconX }),
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => DatePickerComponent)
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor, MatFormFieldControl<DateTimePickerValue | null> {
  readonly #breakpoints = inject(BreakpointObserver);
  readonly #dialog = inject(MatDialog);
  readonly #focusMonitor = inject(FocusMonitor);
  readonly #elementRef = inject(ElementRef);
  readonly #injector = inject(Injector);
  private _dateAdapter = inject(DateAdapter);
  private _dateFormats = inject(MAT_DATE_FORMATS);

  protected destroyRef = inject(DestroyRef);

  @ViewChild('dateRangeButton') dateRangeButton?: ElementRef<HTMLButtonElement>;

  ngControl = inject(NgControl, { optional: true, self: true });

  @Input() required: boolean = false;
  disabledInput = input<boolean>(false, { alias: 'disabled' });
  private _formDisabled = signal(false);
  @Input() placeholder: string = '';
  future = input<boolean>(false);

  selectedDateRange = model<DateRange<Date> | undefined>();

  selectionChange = output<DateTimePickerValue | undefined>();

  // 内部值存储：{start: string, end: string} 或 null/undefined
  #internalValue = signal<DateTimePickerValue | null | undefined>(undefined);

  // MatFormFieldControl 属性
  readonly stateChanges = new Subject<void>();
  readonly #errorStateSignal = signal(false);
  readonly #focusedSignal = signal(false);
  readonly #id = signal<string>(`date-time-picker-${Math.random().toString(36).substr(2, 9)}`);

  // ControlValueAccessor 回调函数
  private onChange?: (value: any) => void;
  private onTouched?: () => void;

  protected displayStart = computed(() => {
    const range = this.selectedDateRange();
    if (!range?.start) return '';
    return formatDate(range.start, this._dateAdapter, this._dateFormats);
  });

  protected displayEnd = computed(() => {
    const range = this.selectedDateRange();
    if (!range?.end) return '';
    return formatDate(range.end, this._dateAdapter, this._dateFormats);
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
      this.ngControl.statusChanges?.pipe(takeUntilDestroyed()).subscribe(() => {
        this.stateChanges.next();
      });
    }

    // 监听 focus 事件
    this.#focusMonitor
      .monitor(this.#elementRef, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(origin => {
        const isFocused = !!origin;
        this.#focusedSignal.set(isFocused);
        this.stateChanges.next();
        if (!isFocused) {
          this.onTouched?.();
        }
      });

    effect(() => {
      this.disabledInput();
      untracked(() => this.stateChanges.next());
    });
  }

  ref = effect((): void => {
    this.selectedDateRange();
    // 触发 MatFormField 更新
    untracked(() => this.stateChanges.next());
  });

  openDateDialogSelector(): void {
    const isMobile = this.#breakpoints.isMatched([Breakpoints.Handset, Breakpoints.Tablet]);
    const currentValue = this.#internalValue();
    const data: DatePickerModel = {
      dateTimePicker: currentValue ?? undefined,
      future: this.future()
    };

    const dialogRef = this.#dialog.open(DateSelector, {
      width: isMobile ? '100%' : '850px',
      height: isMobile ? '90vh' : '520px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data,
      disableClose: false,
      panelClass: 'date-time-picker-dialog',
      injector: this.#injector
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        tap((result: DatePickerModel | undefined): void => {
          if (result && result.dateTimePicker) {
            const start = new Date(result.dateTimePicker.start);
            const end = new Date(result.dateTimePicker.end);
            
            const startStr = formatDate(start, this._dateAdapter, this._dateFormats);
            const endStr = formatDate(end, this._dateAdapter, this._dateFormats);

            const rangeValue: DateTimePickerValue = {
              start: startStr,
              end: endStr
            };
            this.#internalValue.set(rangeValue);
            // 更新显示用的日期范围
            this.selectedDateRange.set(new DateRange(start, end));
            // 发出用户手动选择的值
            this.selectionChange.emit(rangeValue);
            // 通知表单控件
            if (this.onChange) {
              this.onChange(rangeValue);
            }
          }

          this.onTouched?.();
        })
      )
      .subscribe();
  }

  // ControlValueAccessor 实现
  writeValue(value: any): void {
    // 处理各种值类型：null, undefined, '', {start, end}
    if (value === null || value === undefined || value === '') {
      this.#internalValue.set(null);
      this.selectedDateRange.set(undefined);
    } else if (typeof value === 'object' && value.start && value.end) {
      this.#internalValue.set(value);
      // 尝试转换为 Date 对象以显示在选择器中
      try {
        const startDate = new Date(value.start);
        const endDate = new Date(value.end);
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          this.selectedDateRange.set(new DateRange(startDate, endDate));
        }
      } catch (e) {
        console.warn('Failed to parse date values:', value);
      }
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
    this.stateChanges.next();
  }

  get disabled(): boolean {
    return this.disabledInput() || this._formDisabled();
  }

  // MatFormFieldControl 实现
  get empty(): boolean {
    return !this.#internalValue();
  }

  get shouldPlaceholderFloat(): boolean {
    return this.shouldLabelFloat;
  }

  get focused(): boolean {
    return this.#focusedSignal();
  }

  get errorState(): boolean {
    return this.#errorStateSignal() || (!!this.ngControl?.invalid && (!!this.ngControl?.touched || !!this.ngControl?.dirty));
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  get id(): string {
    return this.#id();
  }

  set value(val: DateTimePickerValue | undefined) {
    if (!val) {
      this.#internalValue.set(null);
    } else {
      this.#internalValue.set(val);
      this.selectedDateRange.set(new DateRange(new Date(val.start), new Date(val.end)));
    }
    this.stateChanges.next();
  }

  get value(): any {
    return this.#internalValue();
  }

  setDescribedByIds(ids: string[]): void {
    // Material form field 使用此方法将错误 ID 传递给控件
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName.toLowerCase() !== 'button') {
      this.dateRangeButton?.nativeElement.focus();
    }
  }

  clear(event?: Event): void {
    event?.stopPropagation();
    this.selectedDateRange.set(undefined);
    this.#internalValue.set(null);
    this.onChange?.(null);
    this.onTouched?.();
    this.selectionChange.emit(undefined);
    this.stateChanges.next();
  }
}
