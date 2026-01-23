import { TimeRange } from './interfaces';

export const DEFAULT_TIME_RANGES: TimeRange[] = [
  { label: '最近5分钟', start: 'offset:-5minutes', end: 'offset:now' },
  { label: '最近15分钟', start: 'offset:-15minutes', end: 'offset:now' },
  { label: '最近30分钟', start: 'offset:-30minutes', end: 'offset:now' },
  { label: '最近1小时', start: 'offset:-1hours', end: 'offset:now' },
  { label: '最近3小时', start: 'offset:-3hours', end: 'offset:now' },
  { label: '最近6小时', start: 'offset:-6hours', end: 'offset:now' },
  { label: '最近12小时', start: 'offset:-12hours', end: 'offset:now' },
  { label: '最近24小时', start: 'offset:-24hours', end: 'offset:now' },
  { label: '最近2天', start: 'offset:-2days', end: 'offset:now' },
  { label: '最近7天', start: 'offset:-7days', end: 'offset:now' },
  { label: '最近30天', start: 'offset:-30days', end: 'offset:now' },
  { label: '最近90天', start: 'offset:-90days', end: 'offset:now' },
  { label: '最近6个月', start: 'offset:-6months', end: 'offset:now' },
  { label: '最近1年', start: 'offset:-1years', end: 'offset:now' },
  { label: '最近2年', start: 'offset:-2years', end: 'offset:now' },
  { label: '最近5年', start: 'offset:-5years', end: 'offset:now' },
  { label: '昨天', start: 'offset:-1days/start', end: 'offset:-1days/end' },
  { label: '前天', start: 'offset:-2days/start', end: 'offset:-2days/end' },
  { label: '上周同一天', start: 'offset:-7days/start', end: 'offset:-7days/end' },
  { label: '今天', start: 'offset:0days/start', end: 'offset:0days/end' },
  { label: '今天至今', start: 'offset:0days/start', end: 'offset:now' },
  { label: '本周至今', start: 'startof:week', end: 'offset:now' },
  { label: '本月至今', start: 'startof:month', end: 'offset:now' },
  { label: '今年至今', start: 'startof:year', end: 'offset:now' }
];

export const FUTURE_TIME_RANGES: TimeRange[] = [
  { label: '未来1天', start: 'offset:now', end: 'offset:+1days' },
  { label: '未来1周', start: 'offset:now', end: 'offset:+1weeks' },
  { label: '未来1月', start: 'offset:now', end: 'offset:+1months' },
  { label: '未来3月', start: 'offset:now', end: 'offset:+3months' }
];
