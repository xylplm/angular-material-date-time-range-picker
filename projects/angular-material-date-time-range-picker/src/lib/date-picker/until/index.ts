import { DateAdapter, MatDateFormats } from '@angular/material/core';

export function formatDate(date: Date, dateAdapter: DateAdapter<any>, dateFormats: MatDateFormats): string {
  const datePart = dateAdapter.format(date, dateFormats.display.dateInput);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${datePart} ${hours}:${minutes}`;
}
