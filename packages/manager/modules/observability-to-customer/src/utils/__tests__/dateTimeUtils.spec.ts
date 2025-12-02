import { describe, expect, it, vi } from 'vitest';

import { TimeRangeOption } from '@/types/TimeRangeOption.type';
import { formatTimeFromDate, getWindowSecAndStep } from '@/utils/dateTimeUtils';

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
});
