# 📅 Angular Material Date Time Range Picker

[![npm version](https://img.shields.io/npm/v/@luoxiao123/angular-material-date-time-range-picker.svg?style=flat-square)](https://www.npmjs.com/package/@luoxiao123/angular-material-date-time-range-picker)
[![license](https://img.shields.io/npm/l/@luoxiao123/angular-material-date-time-range-picker.svg?style=flat-square)](LICENSE)
[![downloads](https://img.shields.io/npm/dm/@luoxiao123/angular-material-date-time-range-picker?style=flat-square)]()
[![GitHub stars](https://img.shields.io/github/stars/xylplm/angular-material-date-time-range-picker.svg?style=flat-square)](https://github.com/xylplm/angular-material-date-time-range-picker)

一个强大而灵活的**日期时间范围选择器**组件库。

[English](README.en.md) | [中文](README.md)

## 📚 目录

- [描述](#描述)
- [安装](#安装)
- [快速开始](#快速开始)
- [使用指南](#使用指南)
- [API 文档](#api-文档)
- [配置](#配置)
- [Angular 版本兼容性](#angular-版本兼容性)
- [贡献](#贡献)
- [许可证](#许可证)

## 描述

基于 **Angular 22** 和 **Angular Material** 构建，提供以下功能：

- 🎯 **直观的日期范围选择界面** - 支持快速预设和精确选择
- 📱 **响应式设计** - 移动设备自动切换为全屏，桌面使用 Dialog
- 🧭 **完整的时间选择** - 支持日期、小时、分钟的精确选择（24小时制）
- 📅 **智能预设** - 相对时间、固定日期、当前周期快捷选择
- 💾 **双向数据绑定** - 支持 ControlValueAccessor 和 ngModel
- 🏗️ **mat-form-field 集成** - 完美适配 Angular Material 表单
- 🎨 **可定制化格式** - 自定义日期和值格式
- ✨ **完全可定制** - 所有选项都可配置
- 📖 **完整的类型定义** - 100% TypeScript 支持
- 🎨 **深色/浅色主题** - 完整支持

**快速链接：**
- 📦 [NPM 包](https://www.npmjs.com/package/@luoxiao123/angular-material-date-time-range-picker)
- 🎨 [在线演示](https://xylplm.github.io/angular-material-date-time-range-picker/)
- 📖 [GitHub 仓库](https://github.com/xylplm/angular-material-date-time-range-picker)

## 安装

通过 npm 安装：

```sh
npm install @luoxiao123/angular-material-date-time-range-picker --save
```

或使用 yarn：

```sh
yarn add @luoxiao123/angular-material-date-time-range-picker
```

## 快速开始

### 使用 Standalone Components（推荐）

```typescript
import { Component } from '@angular/core';
import { DatePickerComponent, DateTimePickerValue } from '@luoxiao123/angular-material-date-time-range-picker';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { zhCN } from 'date-fns/locale';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePickerComponent],
  providers: [
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: zhCN },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  template: `
    <date-time-picker 
      [(ngModel)]="selectedRange"
      [required]="true"
      (selectionChange)="onRangeSelected($event)"
    />
  `,
})
export class AppComponent {
  selectedRange: DateTimePickerValue | undefined;

  onRangeSelected(range: DateTimePickerValue | undefined) {
    if (range) {
      console.log('Start:', range.start);  // 格式化后的字符串 (如 "2024-01-24 14:30") 或时间戳
      console.log('End:', range.end);      // 格式化后的字符串 (如 "2024-01-24 14:30") 或时间戳
    }
  }
}
```

### 在 mat-form-field 中使用

```typescript
<mat-form-field>
  <mat-label>选择日期时间范围</mat-label>
  <date-time-picker
    [(ngModel)]="selectedRange"
    [required]="true"
  />
  @if (formControl.hasError('required')) {
    <mat-error>此字段为必填</mat-error>
  }
</mat-form-field>
```

### 使用响应式表单

```typescript
import { FormControl } from '@angular/forms';

export class AppComponent {
  rangeControl = new FormControl<DateTimePickerValue | null>(null, Validators.required);

  onSubmit() {
    if (this.rangeControl.valid) {
      const range = this.rangeControl.value;
      console.log('Selected range:', range);
    }
  }
}

// 模板
<date-time-picker 
  [formControl]="rangeControl"
/>
```

### 使用 NgModule（传统方式）

如果您使用基于 NgModule 的项目：

```typescript
import { NgModule } from '@angular/core';
import { DatePickerComponent } from '@luoxiao123/angular-material-date-time-range-picker';

@NgModule({
  imports: [DatePickerComponent],
  exports: [DatePickerComponent],
})
export class DateRangeModule {}
```

## API 文档

### 输入属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `ngModel` / `formControl` | `DateTimePickerValue \| null` | - | 选中的日期时间范围（支持双向绑定） |
| `required` | `boolean` | `false` | 是否为必填项 |
| `disabled` | `boolean` | `false` | 是否禁用组件 |
| `placeholder` | `string` | `''` | 输入框占位符 |
| `future` | `boolean` | `false` | 是否允许选择未来日期 |
| `isTimestamp` | `boolean` | `false` | 是否使用时间戳作为输入/输出值（配合 isMillisecondTimestamp 控制精度） |
| `isMillisecondTimestamp` | `boolean` | `false` | 是否为毫秒级时间戳（仅 isTimestamp=true 时生效，默认秒级） |

### 输出事件

| 属性 | 类型 | 说明 |
|------|------|------|
| `selectionChange` | `EventEmitter<DateTimePickerValue \| undefined>` | 日期范围选择完成时触发 |

### 数据结构

#### DateTimePickerValue

| 属性 | 类型 | 说明 |
|------|------|------|
| `start` | `string \| number` | 格式化后的日期时间字符串 (如 "2024-01-24 14:30") 或时间戳（秒/毫秒，取决于 isMillisecondTimestamp） |
| `end` | `string \| number` | 格式化后的日期时间字符串 (如 "2024-01-24 14:30") 或时间戳（秒/毫秒，取决于 isMillisecondTimestamp） |

## 配置

### 自定义日期格式

组件使用 Angular Material 的 `DateAdapter` 和 `MAT_DATE_FORMATS` 进行日期格式化。您可以在应用或组件级别提供自定义的适配器和格式。

推荐使用 `@angular/material-date-fns-adapter` 和 `date-fns`：

```typescript
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { zhCN } from 'date-fns/locale';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  // ...
  providers: [
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: zhCN },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
```

### 设置初始值

```typescript
ngOnInit() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  // 默认模式（字符串）
  this.selectedRange = {
    start: startDate.toISOString(), // 推荐使用 ISO 字符串作为初始值
    end: endDate.toISOString()
  };

  // 时间戳模式（如果启用了 isTimestamp="true"）
  // 秒级：
  // this.selectedRange = {
  //   start: Math.floor(startDate.getTime() / 1000),
  //   end: Math.floor(endDate.getTime() / 1000)
  // };
  // 毫秒级：
  // this.selectedRange = {
  //   start: startDate.getTime(),
  //   end: endDate.getTime()
  // };
}
```

### 禁用组件

```typescript
<date-time-picker 
  [(ngModel)]="selectedRange"
  [disabled]="isLoading"
/>
```

### 启用未来日期选择

```typescript
<date-time-picker 
  [(ngModel)]="selectedRange"
  [future]="true"
  [isTimestamp]="true"
  [isMillisecondTimestamp]="true"
/> 
```

## Angular 版本兼容性

| Angular 版本 | 支持情况 |
|------------|--------|
| 21.x | ✅ 完全支持 |
| 20.x | ⚠️ 可能需要调整 |
| < 20 | ❌ 不支持 |

## 浏览器兼容性

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 常见问题

### Q: 可以在 Angular 20 中使用吗？
A: 当前主线面向 **Angular 22+**。若仍为 Angular 21，请安装 `@luoxiao123/angular-material-date-time-range-picker@21.2.6`。Angular 20 不支持。

### Q: 支持国际化吗？
A: 当前版本使用中文界面。欢迎提交 PR 添加多语言支持。

### Q: 可以自定义样式吗？
A: 支持。组件使用标准的 Material Design 样式，可通过 CSS 变量和自定义 CSS 进行定制。

### Q: 如何处理时区和时间戳精度问题？
A: 
- **默认模式**：组件返回的日期时间字符串基于本地时间（Local Time），格式化结果取决于 `MAT_DATE_FORMATS` 配置。
- **时间戳模式**：
  - `isTimestamp=true` 且 `isMillisecondTimestamp=false` 时，返回秒级时间戳（如 1706016000）。
  - `isTimestamp=true` 且 `isMillisecondTimestamp=true` 时，返回毫秒级时间戳（如 1706016000000）。
  - 需要处理时区转换，建议在获取值后使用 `date-fns` 或 `moment.js` 等库。

### Q: 如何切换秒/毫秒级时间戳？
A: 
- 通过 `[isTimestamp]` 控制是否输出时间戳，通过 `[isMillisecondTimestamp]` 控制精度（默认 false，输出秒级，true 输出毫秒级）。

### Q: 表单如何动态切换时间戳和精度？
A: 
- 参考 Demo 页的“表单测试”区域，使用 `mat-slide-toggle` 控制 `[isTimestamp]` 和 `[isMillisecondTimestamp]`，即可实时切换输出格式。

## 贡献

欢迎提交 Issues 和 Pull Requests！

### 报告 Bug
请提交详细的 bug 报告，包括：
- 重现步骤
- 预期行为
- 实际行为
- 环境信息（Angular 版本、浏览器等）

### 提交功能请求
在提交功能请求前，请先检查是否已存在相关议题。

## 致谢

本项目参考了 [material-tailwind-range-date-picker](https://github.com/omidkh68/material-tailwind-range-date-picker) 和 [Angular Material Datepicker](https://material.angular.dev/components/datepicker/overview) 的设计理念和实现方法，在此感谢这些优秀项目及其开发者！

## 许可证

MIT License © 2026 [xylplm](https://github.com/xylplm)