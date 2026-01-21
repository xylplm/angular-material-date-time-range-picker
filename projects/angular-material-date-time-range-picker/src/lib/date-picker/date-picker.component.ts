import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import {take, tap} from 'rxjs';
import {DateSelector} from './date-selector';
import {DatePipe, NgClass} from '@angular/common';
import {SmartDialogService} from '../shared';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DateRange, MatDatepickerModule} from '@angular/material/datepicker';
import {DatePickerModel, DateTimePicker} from './interfaces';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {TablerIconComponent, provideTablerIcons} from '@luoxiao123/angular-tabler-icons';
import {IconCalendarDue, IconX} from '@luoxiao123/angular-tabler-icons/icons';

@Component({
  selector: 'date-time-picker',
  templateUrl: './date-picker.component.html',
  styles: `:host {
    display: block;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TablerIconComponent, NgClass, MatDatepickerModule, DatePipe],
  providers: [provideTablerIcons({IconCalendarDue, IconX})]
})
export class DatePickerComponent {
  readonly #breakpoints = inject(BreakpointObserver);
  readonly #smartDialog = inject(SmartDialogService);

  protected destroyRef = inject(DestroyRef);

  required = input<boolean>(false);
  disabled = input<boolean>(false);
  optionalFeatures = input<boolean>(true);
  future = input<boolean>(false);

  dateTimePicker = model<DateTimePicker | undefined>();
  selectedDateRange = model<DateRange<Date> | undefined>();

  toggle = signal<boolean>(false);

  selectedDates = output<DateTimePicker | undefined>();

  ref = effect((): void => {
    const dateTimePicker = this.dateTimePicker();

    if (dateTimePicker && dateTimePicker?.start_datetime && dateTimePicker.end_datetime) {
      this.selectedDateRange.set({
        start: new Date(dateTimePicker.start_datetime),
        end: new Date(dateTimePicker.end_datetime)
      } as DateRange<Date>);
    }
  });

  openDateDialogSelector(): void {
    const isMobile = this.#breakpoints.isMatched([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]);
    const data: DatePickerModel = {
      optionalFeatures: this.optionalFeatures(),
      dateTimePicker: this.dateTimePicker(),
      future: this.future()
    };
    const dialogRef = this.#smartDialog.open(DateSelector, {
      width: '850px',
      height: isMobile ? '90vh' : '470px',
      data
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

          this.dateTimePicker.set(result.dateTimePicker);

          this.selectedDates.emit(this.dateTimePicker());
        }
      })
    ).subscribe();
  }
}
