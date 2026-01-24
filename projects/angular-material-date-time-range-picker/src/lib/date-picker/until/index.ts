import { DateAdapter, MatDateFormats } from '@angular/material/core';

/**
 * 格式化日期对象为字符串
 * 
 * 将给定的 Date 对象格式化为包含日期和时间的字符串。
 * 如果 MatDateFormats.display.dateInput 已经包含时间（如 HH:mm:ss），则直接用 adapter 格式化，否则拼接 HH:mm。
 * 始终只保留到分钟。
 *
 * @param date - 要格式化的 Date 对象
 * @param dateAdapter - Angular Material 的 DateAdapter，用于处理日期部分的格式化
 * @param dateFormats - Angular Material 的 MatDateFormats，包含日期格式配置
 * @returns 格式化后的日期时间字符串，例如 "2024-01-24 14:30"
 */
export function formatDate(date: Date, dateAdapter: DateAdapter<any>, dateFormats: MatDateFormats): string {
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  try {
    // 检查 dateInput 格式是否包含小时和分钟
    const formatStr = dateFormats.display?.dateInput || '';
    const hasHour = /H{1,2}|h{1,2}/.test(formatStr);
    const hasMinute = /m{1,2}/.test(formatStr);
    const hasSecond = /s{1,2}/.test(formatStr);
    let formatted = dateAdapter.format(date, formatStr);
    // 如果格式里已经有小时和分钟（或秒），直接返回（但去掉秒）
    if (hasHour && hasMinute) {
      // 如果有秒，去掉秒
      if (hasSecond) {
        // 只保留到分钟
        formatted = formatted.replace(/([0-2]?\d:[0-5]\d):[0-5]\d/, '$1');
      }
      return formatted;
    }
    // 否则拼接 HH:mm
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formatted} ${hours}:${minutes}`;
  } catch (e) {
    // 降级处理：如果 adapter 格式化失败（例如 date-fns 版本兼容性问题），使用原生方法
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}
