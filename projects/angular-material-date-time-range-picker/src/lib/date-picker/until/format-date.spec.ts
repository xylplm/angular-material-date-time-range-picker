import { describe, expect, it } from 'vitest';
import { formatDate } from './index';

describe('formatDate', () => {
  const dateAdapter = {
    format: (date: Date, format: string) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return format.includes('yyyy') ? `${y}-${m}-${d}` : `${m}/${d}/${y}`;
    },
  };

  const dateFormats = {
    parse: { dateInput: 'yyyy-MM-dd' },
    display: { dateInput: 'yyyy-MM-dd' },
  };

  it('returns empty string for invalid dates', () => {
    expect(formatDate(new Date('invalid'), dateAdapter as never, dateFormats as never)).toBe('');
  });

  it('appends hours and minutes when display format has no time', () => {
    const date = new Date(2024, 0, 24, 14, 5);
    expect(formatDate(date, dateAdapter as never, dateFormats as never)).toBe('2024-01-24 14:05');
  });
});
