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
- 🧭 **Complete Time Selection** - Support for precise selection of dates, hours, and minutes
- 📅 **Smart Presets** - Quick selection for relative time, fixed dates, and current periods
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
import { DatePickerComponent, DateTimePicker } from '@luoxiao123/angular-material-date-time-range-picker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePickerComponent],
  template: `
    <date-time-picker 
      [(dateTimePicker)]="selectedRange"
      [required]="true"
      [optionalFeatures]="true"
      (selectedDates)="onRangeSelected($event)"
    />
  `,
})
export class AppComponent {
  selectedRange: DateTimePicker | undefined;

  onRangeSelected(range: DateTimePicker | undefined) {
    if (range) {
      console.log('Start:', range.start_datetime);
      console.log('End:', range.end_datetime);
    }
  }
}
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

### NgModule (Legacy)

For older Angular projects using NgModule architecture, simply import the `DatePickerComponent`.

## API Documentation

All input properties are optional. At least one time range binding should be configured.

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dateTimePicker` | `DateTimePicker \| undefined` | - | Selected date time range (supports two-way binding) |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `optionalFeatures` | `boolean` | `true` | Whether to enable week selection and hour range selection |
| `future` | `boolean` | `false` | Whether to allow selecting future dates |

### Output Events

| Property | Type | Description |
|----------|------|-------------|
| `selectedDates` | `EventEmitter<DateTimePicker \| undefined>` | Triggered when date range selection is completed |

### Data Structures

#### DateTimePicker

| Property | Type | Description |
|----------|------|-------------|
| `start_datetime` | `string` | Start date time (ISO 8601) |
| `end_datetime` | `string` | End date time (ISO 8601) |
| `start_hour` | `number` | Start hour (0-23) |
| `start_minute` | `number` | Start minute (0-59) |
| `end_hour` | `number` | End hour (0-23) |
| `end_minute` | `number` | End minute (0-59) |
| `week_days` | `string[]` | Selected week days |

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
  [(dateTimePicker)]="selectedRange"
  [required]="true"
  [disabled]="isLoading"
  [optionalFeatures]="true"
  [future]="false"
  (selectedDates)="onRangeSelected($event)"
/>
```

### Disable Component

```typescript
<date-time-picker 
  [(dateTimePicker)]="selectedRange"
  [disabled]="isLoading"
/>
```

### Set Initial Value

```typescript
ngOnInit() {
  this.selectedRange = {
    start_datetime: new Date(2026, 0, 1).toISOString(),
    end_datetime: new Date(2026, 0, 31).toISOString(),
    start_hour: 9,
    start_minute: 0,
    end_hour: 17,
    end_minute: 0
  };
}
```

### Enable Future Date Selection

```typescript
<date-time-picker 
  [(dateTimePicker)]="selectedRange"
  [future]="true"
/>
```

### Disable Optional Features

```typescript
<date-time-picker 
  [(dateTimePicker)]="selectedRange"
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
