import { describe, expect, it } from 'vitest';

import { clamp } from '@/utils/number.utils';

describe('number.utils', () => {
  describe('clamp', () => {
    it('should return value when within bounds', () => {
      // Arrange
      const value = 5;
      const min = 1;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(5);
    });

    it('should return min when value is below minimum', () => {
      // Arrange
      const value = 0;
      const min = 1;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(1);
    });

    it('should return max when value is above maximum', () => {
      // Arrange
      const value = 15;
      const min = 1;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(10);
    });

    it('should return min when value is undefined', () => {
      // Arrange
      const value = undefined;
      const min = 1;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(1);
    });

    it('should return min when value is NaN', () => {
      // Arrange
      const value = NaN;
      const min = 1;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(1);
    });

    it('should return min when value equals min', () => {
      // Arrange
      const value = 1;
      const min = 1;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(1);
    });

    it('should return max when value equals max', () => {
      // Arrange
      const value = 10;
      const min = 1;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(10);
    });

    it('should handle negative values', () => {
      // Arrange
      const value = -5;
      const min = -10;
      const max = -1;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(-5);
    });

    it('should clamp negative value to negative min', () => {
      // Arrange
      const value = -15;
      const min = -10;
      const max = -1;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(-10);
    });

    it('should clamp negative value to negative max', () => {
      // Arrange
      const value = 0;
      const min = -10;
      const max = -1;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(-1);
    });

    it('should handle decimal values', () => {
      // Arrange
      const value = 5.5;
      const min = 1.2;
      const max = 10.8;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(5.5);
    });

    it('should clamp decimal value to decimal min', () => {
      // Arrange
      const value = 0.5;
      const min = 1.2;
      const max = 10.8;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(1.2);
    });

    it('should clamp decimal value to decimal max', () => {
      // Arrange
      const value = 15.9;
      const min = 1.2;
      const max = 10.8;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(10.8);
    });

    it('should handle zero as value', () => {
      // Arrange
      const value = 0;
      const min = -5;
      const max = 5;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(0);
    });

    it('should handle zero as min', () => {
      // Arrange
      const value = 5;
      const min = 0;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(5);
    });

    it('should handle zero as max', () => {
      // Arrange
      const value = -5;
      const min = -10;
      const max = 0;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(-5);
    });

    it('should handle when min equals max', () => {
      // Arrange
      const value = 5;
      const min = 10;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(10);
    });

    it('should handle very large numbers', () => {
      // Arrange
      const value = 1000000;
      const min = 1;
      const max = 999999;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(999999);
    });

    it('should handle very small numbers', () => {
      // Arrange
      const value = 0.000001;
      const min = 0.000002;
      const max = 0.000010;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(0.000002);
    });
  });
});
