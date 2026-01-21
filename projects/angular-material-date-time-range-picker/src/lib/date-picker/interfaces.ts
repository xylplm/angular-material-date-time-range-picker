export interface DateTimePickerValue {
  start: string;
  end: string;
}

export interface DatePickerModel {
  optionalFeatures: boolean;
  dateTimePicker?: DateTimePickerValue | null;
  future: boolean;
  dateFormat?: string;
  valueFormat?: string;
}

export interface TimeRange {
  label: string;
  start: string;
  end: string;
}

export interface WeekType {
  label: string;
  value: number;
}

export interface Weekday {
  label: string;
  data: string;
  value: number;
  selected: boolean;
}

export interface HourType {
  label: string;
  value: number;
  selected: boolean;
}
