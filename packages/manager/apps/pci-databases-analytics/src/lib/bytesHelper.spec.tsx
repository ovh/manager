import { describe, it, expect, vi } from 'vitest';
import {
  compareStorage,
  addStorage,
  subtractStorage,
  formatStorage,
} from '@/lib/bytesHelper';

// Mock i18next
vi.mock('i18next', () => {
  const translations: { [key: string]: string } = {
    'unitShort-B': 'o',
    'unitShort-KB': 'Ko',
    'unitShort-MB': 'Mo',
    'unitShort-GB': 'Go',
    'unitShort-TB': 'To',
    'unitShort-PB': 'Po',
    'unitLong-B': 'octets',
    'unitLong-KB': 'kilooctets',
    'unitLong-MB': 'mégaoctets',
    'unitLong-GB': 'gigaoctets',
    'unitLong-TB': 'téraoctets',
    'unitLong-PB': 'pétaoctets',
  };
  return {
    default: {
      t: vi.fn((key: string) => translations[key]),
    },
  };
});

describe('Storage Functions', () => {
  describe('compareStorage', () => {
    it('should correctly compare storage units and values', () => {
      expect(
        compareStorage({ unit: 'GB', value: 1 }, { unit: 'MB', value: 1000 }),
      ).toBe(0);
      expect(
        compareStorage({ unit: 'GB', value: 1 }, { unit: 'TB', value: 0.5 }),
      ).toBe(-1);
      expect(
        compareStorage({ unit: 'GB', value: 2 }, { unit: 'GB', value: 1 }),
      ).toBe(1);
    });
  });

  describe('addStorage', () => {
    it('should correctly add two storage objects', () => {
      expect(
        addStorage({ unit: 'GB', value: 1 }, { unit: 'GB', value: 2 }),
      ).toEqual({ unit: 'GB', value: 3 });
      expect(
        addStorage({ unit: 'GB', value: 0.5 }, { unit: 'TB', value: 0.5 }),
      ).toEqual({ unit: 'GB', value: 500.5 });
    });
  });

  describe('subtractStorage', () => {
    it('should correctly subtract two storage objects', () => {
      expect(
        subtractStorage({ unit: 'TB', value: 1 }, { unit: 'GB', value: 500 }),
      ).toEqual({ unit: 'GB', value: 500 });
      expect(
        subtractStorage({ unit: 'GB', value: 2 }, { unit: 'GB', value: 1 }),
      ).toEqual({ unit: 'GB', value: 1 });
    });
  });

  describe('formatStorage', () => {
    it('should correctly format storage objects into strings', () => {
      expect(formatStorage({ unit: 'GB', value: 1024 }, 2, true)).toBe(
        '1.02 To',
      );
      expect(formatStorage({ unit: 'MB', value: 1000 }, 0, false)).toBe(
        '1 gigaoctets',
      );
    });
  });
});
