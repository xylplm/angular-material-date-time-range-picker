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

Built with **Angular 21** and **Angular Material**, providing the following features:

- 🎯 **Intuitive Date Range Selection Interface** - Support for quick presets and precise selection
- 📱 **Responsive Design** - Automatically switches to fullscreen on mobile, uses Dialog on desktop
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
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { enUS } from 'date-fns/locale';

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
    { provide: MAT_DATE_LOCALE, useValue: enUS },
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

## API Documentation

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ngModel` / `formControl` | `DateTimePickerValue \| null` | - | Selected date time range (supports two-way binding) |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `placeholder` | `string` | `''` | Input placeholder text |
| `future` | `boolean` | `false` | Whether to allow selecting future dates |

### Output Events

| Property | Type | Description |
|----------|------|-------------|
| `selectionChange` | `EventEmitter<DateTimePickerValue \| undefined>` | Triggered when date range selection is completed |

### Data Structures

#### DateTimePickerValue

| Property | Type | Description |
|----------|------|-------------|
| `start` | `string` | Formatted start date time (based on MAT_DATE_FORMATS + HH:mm) |
| `end` | `string` | Formatted end date time (based on MAT_DATE_FORMATS + HH:mm) |

## Configuration

### Customize Date Format

The component uses Angular Material's `DateAdapter` and `MAT_DATE_FORMATS` for date formatting. You can provide custom adapter and formats at the application or component level.

Recommended to use `@angular/material-date-fns-adapter` and `date-fns`:

```typescript
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { enUS } from 'date-fns/locale';

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
    { provide: MAT_DATE_LOCALE, useValue: enUS },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
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
A: Yes. The component uses standard Material Design styles and supports customization through CSS variables and custom CSS.

### Q: How do I handle timezone issues?
A: The component returns date-time strings based on local time, formatted according to `MAT_DATE_FORMATS`. If you need to handle time zones, it is recommended to use libraries like `date-fns` or `moment.js` to convert the values after retrieval.

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

This project references the design concepts and implementation methods from [material-tailwind-range-date-picker](https://github.com/omidkh68/material-tailwind-range-date-picker) and [Angular Material Datepicker](https://material.angular.dev/components/datepicker/overview). Thanks to these excellent projects and their developers!

## License

MIT License © 2026 [xylplm](https://github.com/xylplm)