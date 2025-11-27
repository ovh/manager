import { vi, describe, expect, it } from 'vitest';

import { extractTimeFromDate, updateDateTime } from './expiryDateUtils';

describe('extractTimeFromDate', () => {
  it('returns null when date is null', () => {
    expect(extractTimeFromDate(null)).toBeNull();
  });

  it('extract the hours and minutes of the given date', () => {
    const date = new Date('Fri Jan 16 2026 18:24:31 GMT+0100');
    expect(extractTimeFromDate(date)).toMatch(/\d\d:\d\d/);
  });
});

describe('updateDateTime', () => {
  it('returns null when date is null', () => {
    expect(updateDateTime(null, '18:15')).toBeNull();
  });

  it('does not modify date when time is null', () => {
    const now = new Date();
    const result = updateDateTime(now, null);
    expect(result).not.toBeNull();
    expect(result.getTime()).toEqual(now.getTime());
  });

  it('returns a new date with the updated time', () => {
    const originalDate = new Date('Fri Jan 16 2026 18:24:31 GMT+0100');
    const modifiedDate = updateDateTime(originalDate, '07:45');
    expect(extractTimeFromDate(modifiedDate)).toBe('07:45');
  });
});
