export interface DateTimePickerValue {
  start: string;
  end: string;
}

export interface DatePickerModel {
  dateTimePicker?: DateTimePickerValue | null;
  future: boolean;
  dateFormat?: string;
}

export interface TimeRange {
  label: string;
  start: string;
  end: string;
}
