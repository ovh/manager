import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useDateLocale } from './useDateLocale.hook';

vi.mock('intl', () => ({
  DateTimeFormat: vi.fn().mockReturnValue({
    resolvedOptions: () => ({ timeZone: 'UTC' }),
  }),
}));

describe('useDateLocale', () => {
  it('should initialize timeZone, startTime, and endTime', () => {
    const { result } = renderHook(() => useDateLocale());

    const expectedTimeZone = new Intl.DateTimeFormat().resolvedOptions()
      .timeZone;
    expect(result.current.timeZone).toBe(expectedTimeZone);

    const currentDate = new Date();
    const utcOffset = currentDate.getTimezoneOffset() * 60000;

    const expectedStartTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
      0,
      1,
    );
    expectedStartTime.setTime(expectedStartTime.getTime() - utcOffset);

    const expectedEndTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    expectedEndTime.setTime(expectedEndTime.getTime() - utcOffset);

    expect(result.current.startTime.toISOString()).toBe(
      expectedStartTime.toISOString(),
    );
    expect(result.current.endTime.toISOString()).toBe(
      expectedEndTime.toISOString(),
    );
  });

  it('should handle time zone adjustments correctly by recalculating startTime and endTime', () => {
    const { result } = renderHook(() => useDateLocale());

    const utcOffset = 3 * 60 * 60 * 1000;

    const initialStartTime = result.current.startTime;
    const initialEndTime = result.current.endTime;

    const expectedStartTime = new Date(initialStartTime.getTime() - utcOffset);
    const expectedEndTime = new Date(initialEndTime.getTime() - utcOffset);

    expect(initialStartTime.toISOString()).not.toBe(
      expectedStartTime.toISOString(),
    );
    expect(initialEndTime.toISOString()).not.toBe(
      expectedEndTime.toISOString(),
    );

    expect(expectedStartTime.toISOString()).toBe(
      new Date(initialStartTime.getTime() - utcOffset).toISOString(),
    );
  });

  it('should update startTime when handleStartTimeChange is called', () => {
    const { result } = renderHook(() => useDateLocale());

    const newStartTime = new Date(Date.UTC(2025, 0, 1, 0, 0, 0));

    act(() => {
      result.current.handleStartTimeChange(newStartTime);
    });

    const currentUtcOffset = new Date().getTimezoneOffset() * 60000;
    const expectedStartTime = new Date(
      newStartTime.getTime() - currentUtcOffset,
    );

    expect(result.current.startTime.toISOString()).toBe(
      expectedStartTime.toISOString(),
    );
  });

  it('should update endTime when handleEndTimeChange is called', () => {
    const { result } = renderHook(() => useDateLocale());
    const newEndTime = new Date(2025, 0, 10);

    act(() => {
      result.current.handleEndTimeChange(newEndTime);
    });

    const expectedEndTime = new Date(newEndTime);
    expectedEndTime.setHours(23, 59, 59, 999);

    expect(result.current.endTime).toEqual(expectedEndTime);
  });
});
