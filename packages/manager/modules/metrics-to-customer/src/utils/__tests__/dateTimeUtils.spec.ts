import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { TimeRangeOption } from '@/types/TimeRangeOption.type';
import {
  formatTimeFromDate,
  getWindowSecAndStep,
  formatDateTime,
  calculateDateTimeRange,
  calculateTimestamp,
  getLocaleObject,
} from '@/utils/dateTimeUtils';
import * as managerCoreUtils from '@ovh-ux/manager-core-utils';

vi.mock('@ovh-ux/manager-core-utils', () => ({
  getDateFnsLocale: vi.fn((locale: string) => {
    if (locale === 'fr_FR') return 'fr';
    if (locale === 'en_GB') return 'enGB';
    return 'fr';
  }),
}));

describe('dateTimeUtils', () => {
  describe('getWindowSecAndStep', () => {
    it('should return default values for invalid timeRangeOption', () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Act
      const result = getWindowSecAndStep(null as unknown as TimeRangeOption);

      // Assert
      expect(result).toEqual({
        windowSec: 60 * 60, // 1 hour default
        step: 60, // 1 minute default
      });
      expect(consoleSpy).toHaveBeenCalledWith('Invalid timeRangeOption provided, using defaults');
      consoleSpy.mockRestore();
    });

    it('should return default values for timeRangeOption without value', () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const invalidOption = { rangeInSeconds: 3600 } as TimeRangeOption;

      // Act
      const result = getWindowSecAndStep(invalidOption);

      // Assert
      expect(result).toEqual({
        windowSec: 60 * 60,
        step: 60,
      });
      expect(consoleSpy).toHaveBeenCalledWith('Invalid timeRangeOption provided, using defaults');
      consoleSpy.mockRestore();
    });

    it('should return correct values for 1h time range', () => {
      // Arrange
      const timeOption: TimeRangeOption = {
        value: '1h',
        rangeInSeconds: 60 * 60,
      };

      // Act
      const result = getWindowSecAndStep(timeOption);

      // Assert
      expect(result).toEqual({
        windowSec: 60 * 60, // 1 hour
        step: 60, // 1 minute
      });
    });

    it('should return correct values for 12h time range', () => {
      // Arrange
      const timeOption: TimeRangeOption = {
        value: '12h',
        rangeInSeconds: 12 * 60 * 60,
      };

      // Act
      const result = getWindowSecAndStep(timeOption);

      // Assert
      expect(result).toEqual({
        windowSec: 12 * 60 * 60, // 12 hours
        step: 60, // 1 minute
      });
    });

    it('should return correct values for 24h time range', () => {
      // Arrange
      const timeOption: TimeRangeOption = {
        value: '24h',
        rangeInSeconds: 24 * 60 * 60,
      };

      // Act
      const result = getWindowSecAndStep(timeOption);

      // Assert
      expect(result).toEqual({
        windowSec: 24 * 60 * 60, // 24 hours
        step: 60, // 1 minute
      });
    });

    it('should return correct values for custom time range', () => {
      // Arrange
      const timeOption: TimeRangeOption = {
        value: 'custom',
        rangeInSeconds: -1,
      };

      // Act
      const result = getWindowSecAndStep(timeOption);

      // Assert
      expect(result).toEqual({
        windowSec: 24 * 60 * 60, // 1 day
        step: 60, // 1 minute
      });
    });

    it('should return default values for unknown time range value', () => {
      // Arrange
      const timeOption: TimeRangeOption = {
        value: 'unknown',
        rangeInSeconds: 1000,
      };

      // Act
      const result = getWindowSecAndStep(timeOption);

      // Assert
      expect(result).toEqual({
        windowSec: 60 * 60, // default
        step: 60, // default
      });
    });
  });

  describe('formatTimeFromDate', () => {
    it('should format current date when no value provided', () => {
      // Arrange
      const mockDate = new Date('2024-01-15T14:30:45');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

      // Act
      const result = formatTimeFromDate();

      // Assert
      expect(result).toBe('14:30:45');
      vi.restoreAllMocks();
    });

    it('should format date string correctly', () => {
      // Arrange
      const dateString = '2024-01-15T09:05:23';

      // Act
      const result = formatTimeFromDate(dateString);

      // Assert
      expect(result).toBe('09:05:23');
    });

    it('should format Date object correctly', () => {
      // Arrange
      const date = new Date('2024-01-15T23:59:59');

      // Act
      const result = formatTimeFromDate(date);

      // Assert
      expect(result).toBe('23:59:59');
    });

    it('should pad single digit hours, minutes, and seconds', () => {
      // Arrange
      const date = new Date('2024-01-15T01:02:03');

      // Act
      const result = formatTimeFromDate(date);

      // Assert
      expect(result).toBe('01:02:03');
    });

    it('should format midnight correctly', () => {
      // Arrange
      const date = new Date('2024-01-15T00:00:00');

      // Act
      const result = formatTimeFromDate(date);

      // Assert
      expect(result).toBe('00:00:00');
    });

    it('should format end of day correctly', () => {
      // Arrange
      const date = new Date('2024-01-15T23:59:59');

      // Act
      const result = formatTimeFromDate(date);

      // Assert
      expect(result).toBe('23:59:59');
    });

    it('should handle date with single digit values', () => {
      // Arrange
      const date = new Date('2024-01-15T05:07:09');

      // Act
      const result = formatTimeFromDate(date);

      // Assert
      expect(result).toBe('05:07:09');
    });
  });

  describe('formatDateTime', () => {
    it('should format Unix timestamp in seconds correctly', () => {
      // Arrange
      const date = new Date('2024-01-15T12:00:00');
      const timestampInSeconds = Math.floor(date.getTime() / 1000);

      // Act
      const result = formatDateTime(timestampInSeconds);

      // Assert
      // Verify format matches yyyy-MM-dd HH:mm:ss pattern
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      // Verify it formats the same date correctly
      const formattedDate = new Date(timestampInSeconds * 1000);
      const expected = `${formattedDate.getFullYear()}-${String(formattedDate.getMonth() + 1).padStart(2, '0')}-${String(formattedDate.getDate()).padStart(2, '0')} ${String(formattedDate.getHours()).padStart(2, '0')}:${String(formattedDate.getMinutes()).padStart(2, '0')}:${String(formattedDate.getSeconds()).padStart(2, '0')}`;
      expect(result).toBe(expected);
    });

    it('should format timestamp with single digit values correctly', () => {
      // Arrange
      const date = new Date('2024-01-15T09:20:03');
      const timestampInSeconds = Math.floor(date.getTime() / 1000);

      // Act
      const result = formatDateTime(timestampInSeconds);

      // Assert
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      const formattedDate = new Date(timestampInSeconds * 1000);
      const expected = `${formattedDate.getFullYear()}-${String(formattedDate.getMonth() + 1).padStart(2, '0')}-${String(formattedDate.getDate()).padStart(2, '0')} ${String(formattedDate.getHours()).padStart(2, '0')}:${String(formattedDate.getMinutes()).padStart(2, '0')}:${String(formattedDate.getSeconds()).padStart(2, '0')}`;
      expect(result).toBe(expected);
    });

    it('should format timestamp at midnight correctly', () => {
      // Arrange
      const date = new Date('2024-01-15T00:00:00');
      const timestampInSeconds = Math.floor(date.getTime() / 1000);

      // Act
      const result = formatDateTime(timestampInSeconds);

      // Assert
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      const formattedDate = new Date(timestampInSeconds * 1000);
      const expected = `${formattedDate.getFullYear()}-${String(formattedDate.getMonth() + 1).padStart(2, '0')}-${String(formattedDate.getDate()).padStart(2, '0')} ${String(formattedDate.getHours()).padStart(2, '0')}:${String(formattedDate.getMinutes()).padStart(2, '0')}:${String(formattedDate.getSeconds()).padStart(2, '0')}`;
      expect(result).toBe(expected);
    });

    it('should format timestamp at end of day correctly', () => {
      // Arrange
      const date = new Date('2024-01-15T23:59:59');
      const timestampInSeconds = Math.floor(date.getTime() / 1000);

      // Act
      const result = formatDateTime(timestampInSeconds);

      // Assert
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      const formattedDate = new Date(timestampInSeconds * 1000);
      const expected = `${formattedDate.getFullYear()}-${String(formattedDate.getMonth() + 1).padStart(2, '0')}-${String(formattedDate.getDate()).padStart(2, '0')} ${String(formattedDate.getHours()).padStart(2, '0')}:${String(formattedDate.getMinutes()).padStart(2, '0')}:${String(formattedDate.getSeconds()).padStart(2, '0')}`;
      expect(result).toBe(expected);
    });
  });

  describe('calculateDateTimeRange', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should calculate range from current time when no dates provided', () => {
      // Arrange
      const mockNow = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(mockNow);
      const timeOption: TimeRangeOption = {
        value: '1h',
        rangeInSeconds: 3600,
      };

      // Act
      const result = calculateDateTimeRange(timeOption);

      // Assert
      expect(result.endDateTime).toBe(Math.floor(mockNow.getTime() / 1000));
      expect(result.startDateTime).toBe(result.endDateTime - 3600);
    });

    it('should use provided endDateTime when provided', () => {
      // Arrange
      const timeOption: TimeRangeOption = {
        value: '12h',
        rangeInSeconds: 43200,
      };
      const providedEndDateTime = 1705320000; // 2024-01-15 12:00:00 UTC

      // Act
      const result = calculateDateTimeRange(timeOption, providedEndDateTime);

      // Assert
      expect(result.endDateTime).toBe(providedEndDateTime);
      expect(result.startDateTime).toBe(providedEndDateTime - 43200);
    });

    it('should use provided startDateTime when provided', () => {
      // Arrange
      const timeOption: TimeRangeOption = {
        value: '24h',
        rangeInSeconds: 86400,
      };
      const providedEndDateTime = 1705320000; // 2024-01-15 12:00:00 UTC
      const providedStartDateTime = 1705233600; // 2024-01-14 12:00:00 UTC

      // Act
      const result = calculateDateTimeRange(
        timeOption,
        providedEndDateTime,
        providedStartDateTime,
      );

      // Assert
      expect(result.endDateTime).toBe(providedEndDateTime);
      expect(result.startDateTime).toBe(providedStartDateTime);
    });

    it('should handle custom range correctly', () => {
      // Arrange
      const timeOption: TimeRangeOption = {
        value: 'custom',
        rangeInSeconds: 7200, // 2 hours
      };
      const providedEndDateTime = 1705320000; // 2024-01-15 12:00:00 UTC

      // Act
      const result = calculateDateTimeRange(timeOption, providedEndDateTime);

      // Assert
      expect(result.endDateTime).toBe(providedEndDateTime);
      expect(result.startDateTime).toBe(providedEndDateTime - 7200);
    });
  });

  describe('calculateTimestamp', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should calculate timestamp from date and time string', () => {
      // Arrange
      const date = new Date('2024-01-15T00:00:00');
      const time = '14:30:45';

      // Act
      const result = calculateTimestamp(date, time);

      // Assert
      // The function sets hours/minutes/seconds in local time
      const expectedDate = new Date(date);
      expectedDate.setHours(14, 30, 45, 0);
      expect(result).toBe(Math.floor(expectedDate.getTime() / 1000));
    });

    it('should return current timestamp when date is null', () => {
      // Arrange
      const mockDate = new Date('2024-01-15T12:00:00');
      vi.setSystemTime(mockDate);
      const time = '14:30:45';

      // Act
      const result = calculateTimestamp(null, time);

      // Assert
      expect(result).toBe(Math.floor(mockDate.getTime() / 1000));
    });

    it('should handle time with single digit values', () => {
      // Arrange
      const date = new Date('2024-01-15T00:00:00');
      const time = '05:07:09';

      // Act
      const result = calculateTimestamp(date, time);

      // Assert
      const expectedDate = new Date(date);
      expectedDate.setHours(5, 7, 9, 0);
      expect(result).toBe(Math.floor(expectedDate.getTime() / 1000));
    });

    it('should handle time at midnight', () => {
      // Arrange
      const date = new Date('2024-01-15T00:00:00');
      const time = '00:00:00';

      // Act
      const result = calculateTimestamp(date, time);

      // Assert
      const expectedDate = new Date(date);
      expectedDate.setHours(0, 0, 0, 0);
      expect(result).toBe(Math.floor(expectedDate.getTime() / 1000));
    });

    it('should handle time at end of day', () => {
      // Arrange
      const date = new Date('2024-01-15T00:00:00');
      const time = '23:59:59';

      // Act
      const result = calculateTimestamp(date, time);

      // Assert
      const expectedDate = new Date(date);
      expectedDate.setHours(23, 59, 59, 0);
      expect(result).toBe(Math.floor(expectedDate.getTime() / 1000));
    });

    it('should default to 0 for missing hours, minutes, or seconds', () => {
      // Arrange
      const date = new Date('2024-01-15T00:00:00');
      const time = '14:30'; // Missing seconds

      // Act
      const result = calculateTimestamp(date, time);

      // Assert
      const expectedDate = new Date(date);
      expectedDate.setHours(14, 30, 0, 0);
      expect(result).toBe(Math.floor(expectedDate.getTime() / 1000));
    });
  });

  describe('getLocaleObject', () => {
    it('should return French locale as fallback when no locale provided', () => {
      // Act
      const result = getLocaleObject();

      // Assert
      expect(result).toBeDefined();
      expect(result.code).toBe('fr');
    });

    it('should return French locale for fr_FR', () => {
      // Act
      const result = getLocaleObject('fr_FR');

      // Assert
      expect(result).toBeDefined();
      expect(result.code).toBe('fr');
    });

    it('should return English locale for en_GB', () => {
      // Act
      const result = getLocaleObject('en_GB');

      // Assert
      expect(result).toBeDefined();
      expect(result.code).toBe('en-GB');
    });

    it('should return French locale as fallback when invalid locale provided', () => {
      // Arrange
      vi.mocked(managerCoreUtils.getDateFnsLocale).mockReturnValueOnce('invalid_locale_key' as any);

      // Act
      const result = getLocaleObject('invalid_locale');

      // Assert
      expect(result).toBeDefined();
      expect(result.code).toBe('fr');
    });

    it('should handle locale string that throws error', () => {
      // Arrange
      vi.mocked(managerCoreUtils.getDateFnsLocale).mockImplementationOnce(() => {
        throw new Error('Invalid locale');
      });

      // Act
      const result = getLocaleObject('fr_FR');

      // Assert
      expect(result).toBeDefined();
      expect(result.code).toBe('fr');
    });
  });
});
