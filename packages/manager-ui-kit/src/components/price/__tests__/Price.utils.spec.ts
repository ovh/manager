import { vi, describe, it, expect } from 'vitest';
import {
  getPrice,
  convertIntervalPrice,
  getPriceTextFormatted,
} from '../Price.utils';
import { IntervalUnitType, OvhSubsidiary } from '../../../enumTypes';

describe('getPrice', () => {
  it('should return value divided by 100000000 when tax is not provided', () => {
    expect(getPrice(200000000)).toBe(2);
  });

  it('should add tax to value before dividing', () => {
    expect(getPrice(200000000, 100000000)).toBe(3);
  });

  it('should return zero when both value and tax are zero', () => {
    expect(getPrice(0, 0)).toBe(0);
  });
});

describe('convertIntervalPrice', () => {
  it('should convert yearly price to daily rate', () => {
    expect(convertIntervalPrice(365, IntervalUnitType.day)).toBe(1);
  });

  it('should convert yearly price to monthly rate', () => {
    expect(convertIntervalPrice(120, IntervalUnitType.month)).toBe(10);
  });

  it('should return same price for yearly interval', () => {
    const price = 99.99;
    expect(convertIntervalPrice(price, IntervalUnitType.year)).toBe(price);
  });

  it('should return same price for none interval', () => {
    const price = 50;
    expect(convertIntervalPrice(price, IntervalUnitType.none)).toBe(price);
  });

  it('should return original price if intervalUnit is invalid', () => {
    const price = 100;
    // @ts-expect-error - testing invalid input
    expect(convertIntervalPrice(price, 'invalid')).toBe(price);
  });
});

describe('getPriceTextFormatted', () => {
  const mockFormat = vi.fn();

  // Mock the Intl.NumberFormat class
  const mockNumberFormat = vi
    .spyOn(Intl, 'NumberFormat')
    .mockImplementation((locale) => {
      if (locale === 'invalid-locale') {
        throw new Error('Invalid locale');
      }
      return {
        format: mockFormat,
      } as unknown as Intl.NumberFormat;
    });

  beforeEach(() => {
    mockFormat.mockReset();
    mockNumberFormat.mockClear();
  });

  it('should format price correctly for valid locale and subsidiary', () => {
    getPriceTextFormatted(OvhSubsidiary.FR, 'fr_FR', 99.99);
    expect(mockNumberFormat).toHaveBeenCalledWith('fr-FR', {
      currency: 'EUR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: 'currency',
    });
    expect(Intl.NumberFormat).toHaveBeenCalledOnce();
  });

  it('should fallback to fr-FR when locale is invalid', () => {
    getPriceTextFormatted(OvhSubsidiary.US, 'invalid_locale', 100);
    expect(mockNumberFormat).toHaveBeenCalledWith('invalid-locale', {
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: 'currency',
    });
    expect(Intl.NumberFormat).toHaveBeenCalledTimes(2);
    expect(mockNumberFormat).toHaveBeenCalledWith('fr-FR', {
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: 'currency',
    });
  });

  it('should format with correct currency based on subsidiary', () => {
    getPriceTextFormatted(OvhSubsidiary.US, 'en_US', 123.45);
    expect(mockNumberFormat).toHaveBeenCalledWith('en-US', {
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: 'currency',
    });
    expect(Intl.NumberFormat).toHaveBeenCalledOnce();
  });

  it('should format large numbers with thousand separators', () => {
    getPriceTextFormatted(OvhSubsidiary.CA, 'fr_CA', 1234567.89);
    expect(mockNumberFormat).toHaveBeenCalledWith('fr-CA', {
      currency: 'CAD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: 'currency',
    });
    expect(Intl.NumberFormat).toHaveBeenCalledOnce();
  });
});
