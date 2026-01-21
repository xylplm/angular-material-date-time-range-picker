import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  ViewChild,
  ElementRef,
  Optional,
  Input,
  forwardRef
} from '@angular/core';
import {take, tap} from 'rxjs';
import {DateSelector} from './date-selector';
import {DatePipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DateRange, MatDatepickerModule} from '@angular/material/datepicker';
import {DatePickerModel, DateTimePickerValue} from './interfaces';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {TablerIconComponent, provideTablerIcons} from '@luoxiao123/angular-tabler-icons';
import {IconCalendarDue, IconX} from '@luoxiao123/angular-tabler-icons/icons';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm
} from '@angular/forms';
import {
  MatFormFieldControl,
  MatFormField
} from '@angular/material/form-field';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {FocusMonitor} from '@angular/cdk/a11y';

@Component({
  selector: 'date-time-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TablerIconComponent, MatDatepickerModule, DatePipe, MatDialogModule],
  providers: [
    provideTablerIcons({IconCalendarDue, IconX}),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    },
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
  readonly #matFormField = inject(MatFormField, {optional: true});

  protected destroyRef = inject(DestroyRef);

  @ViewChild('dateRangeButton') dateRangeButton?: ElementRef<HTMLButtonElement>;

  ngControl: NgControl | null = null;

  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() dateFormat: string = 'yyyy年M月d日 HH:mm';
  @Input() valueFormat: string = 'yyyy-MM-dd HH:mm:ss';
  @Input() dateTimePicker: DateTimePickerValue | undefined;
  @Input() placeholder: string = '';
  optionalFeatures = input<boolean>(true);
  future = input<boolean>(false);

  selectedDateRange = model<DateRange<Date> | undefined>();

  toggle = signal<boolean>(false);

  selectionChange = output<DateTimePickerValue | undefined>();

  // 内部值存储：{start: string, end: string} 或 null/undefined
  #internalValue = signal<DateTimePickerValue | null | undefined>(undefined);

  // MatFormFieldControl 属性
  readonly stateChanges = new Subject<void>();
  readonly #errorStateSignal = signal(false);
  readonly #shouldLabelFloatSignal = signal(false);
  readonly #focusedSignal = signal(false);
  readonly #id = signal<string>(`date-time-picker-${Math.random().toString(36).substr(2, 9)}`);

  // ControlValueAccessor 回调函数
  private onChange?: (value: any) => void;
  private onTouched?: () => void;

  constructor() {
    // 监听 focus 事件
    this.#focusMonitor.monitor(this.#elementRef, true).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(origin => {
      const isFocused = !!origin;
      this.#focusedSignal.set(isFocused);
      this.stateChanges.next();
      if (!isFocused) {
        this.onTouched?.();
      }
    });
  }

  ref = effect((): void => {
    const dateRange = this.selectedDateRange();

    // 触发 MatFormField 更新
    this.stateChanges.next();
    this.#shouldLabelFloatSignal.set(!!dateRange);

    // 通知 ControlValueAccessor（当通过 model 更新时）
    if (dateRange && this.onChange) {
      const value = this.#internalValue();
      if (value) {
        this.onChange(value);
      }
    }
  });

  openDateDialogSelector(): void {
    const isMobile = this.#breakpoints.isMatched([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]);
    const currentValue = this.#internalValue();
    const data: DatePickerModel = {
      optionalFeatures: this.optionalFeatures(),
      dateTimePicker: currentValue ?? undefined,
      future: this.future(),
      dateFormat: this.dateFormat,
      valueFormat: this.valueFormat
    };
    
    const dialogRef = this.#dialog.open(DateSelector, {
      width: isMobile ? '100%' : '850px',
      height: isMobile ? '90vh' : '520px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data,
      disableClose: false,
      panelClass: 'date-time-picker-dialog'
    });

    dialogRef.afterOpened().pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef),
      tap(() => this.toggle.update((status: boolean) => !status))
    ).subscribe();

    dialogRef.afterClosed().pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef),
      tap((result: DatePickerModel | undefined): void => {
        this.toggle.update((status: boolean) => !status);

        if (result && result.dateTimePicker) {
          const rangeValue: DateTimePickerValue = {
            start: result.dateTimePicker.start,
            end: result.dateTimePicker.end
          };
          this.#internalValue.set(rangeValue);
          // 更新显示用的日期范围
          this.selectedDateRange.set(new DateRange(
            new Date(result.dateTimePicker.start),
            new Date(result.dateTimePicker.end)
          ));
          // 发出用户手动选择的值
          this.selectionChange.emit(rangeValue);
          // 通知表单控件
          if (this.onChange) {
            this.onChange(rangeValue);
          }
        }

        this.onTouched?.();
      })
    ).subscribe();
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
    // 可以根据需要在这里处理禁用状态
  }

  // MatFormFieldControl 实现
  get empty(): boolean {
    return !this.#internalValue();
  }

  get shouldPlaceholderFloat(): boolean {
    return this.#shouldLabelFloatSignal();
  }

  get focused(): boolean {
    return this.#focusedSignal();
  }

  get errorState(): boolean {
    return this.#errorStateSignal();
  }

  get shouldLabelFloat(): boolean {
    return this.#shouldLabelFloatSignal();
  }

  get id(): string {
    return this.#id();
  }

  set value(val: DateTimePickerValue | undefined) {
    if (!val) {
      this.#internalValue.set(null);
    } else {
      this.#internalValue.set(val);
      this.selectedDateRange.set(new DateRange(
        new Date(val.start),
        new Date(val.end)
      ));
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
}
