import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { TablerIconComponent } from '@luoxiao123/angular-tabler-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'date-time-input',
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDatepickerModule, FormsModule, TablerIconComponent, CommonModule]
})
export class DateTimeInputComponent {
  label = input<string>('');
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
