import { describe, it, expect } from 'vitest';
import { convertHourlyPriceToMonthly } from './index';
import { HOUR_AVERAGE_IN_MONTH } from '@/constants';

describe('convertHourlyPriceToMonthly', () => {
  it('should convert hourly price to monthly estimate', () => {
    const hourlyPrice = 100;
    const expectedMonthlyEstimate = hourlyPrice * HOUR_AVERAGE_IN_MONTH;

    const result = convertHourlyPriceToMonthly(hourlyPrice);

    expect(result).toBe(expectedMonthlyEstimate);
    expect(result).toBe(73000);
  });

  it('should handle zero price', () => {
    const result = convertHourlyPriceToMonthly(0);

    expect(result).toBe(0);
  });

  it('should handle decimal prices', () => {
    const hourlyPrice = 0.5;
    const expectedMonthlyEstimate = 0.5 * 730;

    const result = convertHourlyPriceToMonthly(hourlyPrice);

    expect(result).toBe(expectedMonthlyEstimate);
    expect(result).toBe(365);
  });

  it('should handle large prices', () => {
    const hourlyPrice = 10000;
    const expectedMonthlyEstimate = 10000 * 730;

    const result = convertHourlyPriceToMonthly(hourlyPrice);

    expect(result).toBe(expectedMonthlyEstimate);
    expect(result).toBe(7300000);
  });
});
