/**
 * 日期时间选择器的值接口
 */
export interface DateTimePickerValue {
  /** 开始时间，可以是格式化后的日期字符串或时间戳（毫秒） */
  start: string | number;
  /** 结束时间，可以是格式化后的日期字符串或时间戳（毫秒） */
  end: string | number;
}

/**
 * 日期选择器弹窗的数据模型
 */
export interface DatePickerModel {
  /** 当前选择的日期时间范围值 */
  dateTimePicker?: DateTimePickerValue | null;
  /** 是否允许选择未来时间 */
  future: boolean;
}

/**
 * 预定义时间范围接口
 */
export interface TimeRange {
  /** 时间范围的显示标签（例如："最近7天"） */
  label: string;
  /** 时间范围的开始时间（日期字符串） */
  start: string;
  /** 时间范围的结束时间（日期字符串） */
  end: string;
}
