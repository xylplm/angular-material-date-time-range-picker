import {
  Component,
  input,
  output,
  ChangeDetectionStrategy
} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {TablerIconComponent} from '@luoxiao123/angular-tabler-icons';
import {IconCalendarDue} from '@luoxiao123/angular-tabler-icons/icons';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'date-time-input',
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDatepickerModule,
    FormsModule,
    TablerIconComponent,
    DecimalPipe
  ]
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

  onDateChange(value: string) {
    this.dateChange.emit(value);
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
