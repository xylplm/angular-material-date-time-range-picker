# 📅 Angular Material Date Time Range Picker

[![npm version](https://img.shields.io/npm/v/@luoxiao123/angular-material-date-time-range-picker.svg?style=flat-square)](https://www.npmjs.com/package/@luoxiao123/angular-material-date-time-range-picker)
[![license](https://img.shields.io/npm/l/@luoxiao123/angular-material-date-time-range-picker.svg?style=flat-square)](LICENSE)
[![downloads](https://img.shields.io/npm/dm/@luoxiao123/angular-material-date-time-range-picker?style=flat-square)]()
[![GitHub stars](https://img.shields.io/github/stars/xylplm/angular-material-date-time-range-picker.svg?style=flat-square)](https://github.com/xylplm/angular-material-date-time-range-picker)

A powerful and flexible **date time range picker** component library.

[English](README.en.md) | [中文](README.md)

## 📚 Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Angular Version Compatibility](#angular-version-compatibility)
- [Contributing](#contributing)
- [License](#license)

## Description

Built with **Angular 21**, **Angular Material**, and **Tailwind CSS v4**, providing the following features:

- 🎯 **Intuitive Date Range Selection Interface** - Support for quick presets and precise selection
- 📱 **Responsive Design** - Automatically switches to BottomSheet on mobile, uses Dialog on desktop
- 🧭 **Complete Time Selection** - Support for precise selection of dates, hours, and minutes (24-hour format)
- 📅 **Smart Presets** - Quick selection for relative time, fixed dates, and current periods
- 💾 **Two-Way Data Binding** - Supports ControlValueAccessor and ngModel
- 🏗️ **mat-form-field Integration** - Perfect compatibility with Angular Material forms
- 🎨 **Customizable Formats** - Custom date and value formats
- ✨ **Fully Customizable** - All options are configurable
- 📖 **Complete Type Definitions** - 100% TypeScript support
- 🎨 **Dark/Light Theme** - Full support for both themes

**Quick Links:**
- 📦 [NPM Package](https://www.npmjs.com/package/@luoxiao123/angular-material-date-time-range-picker)
- 🎨 [Live Demo](https://xylplm.github.io/angular-material-date-time-range-picker/)
- 📖 [GitHub Repository](https://github.com/xylplm/angular-material-date-time-range-picker)

## Installation

Install via npm:

```sh
npm install @luoxiao123/angular-material-date-time-range-picker --save
```

Or using yarn:

```sh
yarn add @luoxiao123/angular-material-date-time-range-picker
```

## Quick Start

### Using Standalone Components (Recommended)

```typescript
import { Component } from '@angular/core';
import { DatePickerComponent, DateTimePickerValue } from '@luoxiao123/angular-material-date-time-range-picker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePickerComponent],
  template: `
    <date-time-picker 
      [(ngModel)]="selectedRange"
      [required]="true"
      [dateFormat]="'MMM d, yyyy HH:mm'"
      [optionalFeatures]="true"
      (selectionChange)="onRangeSelected($event)"
    />
  `,
})
export class AppComponent {
  selectedRange: DateTimePickerValue | undefined;

  onRangeSelected(range: DateTimePickerValue | undefined) {
    if (range) {
      console.log('Start:', range.start);  // ISO 8601 format
      console.log('End:', range.end);      // ISO 8601 format
    }
  }
}
```

### Using with mat-form-field

```typescript
<mat-form-field>
  <mat-label>Select Date Time Range</mat-label>
  <date-time-picker
    matInput
    [(ngModel)]="selectedRange"
    [required]="true"
    [dateFormat]="'yyyy-MM-dd HH:mm'"
  />
  @if (formControl.hasError('required')) {
    <mat-error>This field is required</mat-error>
  }
</mat-form-field>
```

### Using Reactive Forms

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

// Template
<date-time-picker 
  [formControl]="rangeControl"
  [dateFormat]="'yyyy-MM-dd HH:mm'"
/>
```

### Using NgModule (Legacy Approach)

If you're using an NgModule-based project:

```typescript
import { NgModule } from '@angular/core';
import { DatePickerComponent } from '@luoxiao123/angular-material-date-time-range-picker';

@NgModule({
  imports: [DatePickerComponent],
  exports: [DatePickerComponent],
})
export class DateRangeModule {}
```

## Usage Guide

### Standalone Components

The recommended approach for modern Angular applications. Use it directly in your component's imports.

### mat-form-field Integration

The component is perfectly compatible with Angular Material's `mat-form-field` and automatically applies form styles and error messages.

### Two-Way Data Binding

Supports both `[(ngModel)]` and reactive forms with `[formControl]`.

## API Documentation

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ngModel` / `formControl` | `DateTimePickerValue \| null` | - | Selected date time range (supports two-way binding) |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `dateFormat` | `string` | `'MMM d, yyyy HH:mm'` | Date display format (DatePipe format) |
| `valueFormat` | `string` | `'yyyy-MM-dd HH:mm:ss'` | Output value format (DatePipe format) |
| `optionalFeatures` | `boolean` | `true` | Whether to enable week selection and hour range selection |
| `future` | `boolean` | `false` | Whether to allow selecting future dates |

### Output Events

| Property | Type | Description |
|----------|------|-------------|
| `selectionChange` | `EventEmitter<DateTimePickerValue \| undefined>` | Triggered when date range selection is completed |

### Data Structures

#### DateTimePickerValue

| Property | Type | Description |
|----------|------|-------------|
| `start` | `string` | Start date time (ISO 8601) |
| `end` | `string` | End date time (ISO 8601) |

#### TimeRange

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display label |
| `start` | `string` | Start time expression |
| `end` | `string` | End time expression |

## Configuration

### Basic Example

```typescript
<date-time-picker 
  [(ngModel)]="selectedRange"
  [required]="true"
  [disabled]="isLoading"
  [optionalFeatures]="true"
  [future]="false"
  [dateFormat]="'yyyy-MM-dd HH:mm'"
  (selectionChange)="onRangeSelected($event)"
/>
```

### Customize Date Format

```typescript
// Chinese format
[dateFormat]="'yyyy年M月d日 HH:mm'"

// English format
[dateFormat]="'MMM d, yyyy HH:mm'"

// Standard format
[dateFormat]="'yyyy-MM-dd HH:mm:ss'"

// Date only
[dateFormat]="'yyyy-MM-dd'"

// Time only
[dateFormat]="'HH:mm'"
```

### Set Initial Value

```typescript
ngOnInit() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  this.selectedRange = {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  };
}
```

### Disable Component

```typescript
<date-time-picker 
  [(ngModel)]="selectedRange"
  [disabled]="isLoading"
/>
```

### Enable Future Date Selection

```typescript
<date-time-picker 
  [(ngModel)]="selectedRange"
  [future]="true"
/>
```

### Disable Optional Features (Week and Hour Selection)

```typescript
<date-time-picker 
  [(ngModel)]="selectedRange"
  [optionalFeatures]="false"
/>
```

## Angular Version Compatibility

| Angular Version | Support Status |
|------------|--------|
| 21.x | ✅ Fully Supported |
| 20.x | ⚠️ May Require Adjustments |
| < 20 | ❌ Not Supported |

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Frequently Asked Questions

### Q: Can I use this with Angular 20?
A: This library is optimized for Angular 21+. Using it with Angular 20 may have compatibility issues.

### Q: Does it support internationalization?
A: The current version uses a Chinese interface. Pull requests to add multi-language support are welcome.

### Q: Can I customize the styles?
A: Yes. You can customize styles using Tailwind CSS and custom CSS.

### Q: How do I handle timezone issues?
A: The component uses ISO 8601 format with full timezone support.

## Contributing

Issues and Pull Requests are welcome!

### Reporting Bugs
Please submit a detailed bug report including:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment information (Angular version, browser, etc.)

### Submitting Feature Requests
Before submitting a feature request, please check if a similar issue already exists.

## Acknowledgments

This project is a restructured reimplementation based on [material-tailwind-range-date-picker](https://github.com/omidkh68/material-tailwind-range-date-picker). Thanks to the original author for the excellent work!

## License

MIT License © 2026 [xylplm](https://github.com/xylplm)
