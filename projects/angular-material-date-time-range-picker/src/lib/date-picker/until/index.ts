import { DateAdapter, MatDateFormats } from '@angular/material/core';

/**
 * 格式化日期对象为字符串
 * 
 * 将给定的 Date 对象格式化为包含日期和时间的字符串。
 * 日期部分使用提供的 DateAdapter 和 MatDateFormats 进行格式化。
 * 时间部分格式化为 HH:mm (24小时制)。
 *
 * @param date - 要格式化的 Date 对象
 * @param dateAdapter - Angular Material 的 DateAdapter，用于处理日期部分的格式化
 * @param dateFormats - Angular Material 的 MatDateFormats，包含日期格式配置
 * @returns 格式化后的日期时间字符串，例如 "2024-01-24 14:30"
 */
export function formatDate(date: Date, dateAdapter: DateAdapter<any>, dateFormats: MatDateFormats): string {
  const datePart = dateAdapter.format(date, dateFormats.display.dateInput);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${datePart} ${hours}:${minutes}`;
}
