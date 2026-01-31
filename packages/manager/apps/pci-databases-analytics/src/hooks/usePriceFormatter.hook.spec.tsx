import { describe, it } from 'vitest';
import { order } from '@/types/catalog';
import { Locale } from './useLocale';
import { usePriceFormatter } from './usePriceFormatter.hook';

describe('usePriceFormatter', () => {
  it('should format prices with different locales, currencies, and decimal configurations', () => {
    // USD with en_GB locale and 2 decimals
    const usdFormatter = usePriceFormatter({
      locale: Locale.en_GB,
      currency: order.CurrencyCodeEnum.USD,
      decimals: 2,
    });
    expect(usdFormatter(10.5)).toMatch(/\$10\.50/);

    // EUR with fr_FR locale and 2 decimals
    const eurFormatter = usePriceFormatter({
      locale: Locale.fr_FR,
      currency: order.CurrencyCodeEnum.EUR,
      decimals: 2,
    });
    expect(eurFormatter(10.5)).toMatch(/10,50\s*€/);

    // GBP with en_GB locale and 2 decimals
    const gbpFormatter = usePriceFormatter({
      locale: Locale.en_GB,
      currency: order.CurrencyCodeEnum.GBP,
      decimals: 2,
    });
    expect(gbpFormatter(10.5)).toMatch(/£10\.50/);

    // Zero decimals
    const zeroDecimalsFormatter = usePriceFormatter({
      locale: Locale.en_GB,
      currency: order.CurrencyCodeEnum.USD,
      decimals: 0,
    });
    expect(zeroDecimalsFormatter(10.5)).toMatch(/\$11/);
    expect(zeroDecimalsFormatter(10.5)).not.toMatch(/\./);

    // Three decimals
    const threeDecimalsFormatter = usePriceFormatter({
      locale: Locale.en_GB,
      currency: order.CurrencyCodeEnum.USD,
      decimals: 3,
    });
    expect(threeDecimalsFormatter(10.567)).toMatch(/\$10\.567/);

    // Undefined decimals parameter
    const undefinedDecimalsFormatter = usePriceFormatter({
      locale: Locale.en_GB,
      currency: order.CurrencyCodeEnum.USD,
    });
    expect(undefinedDecimalsFormatter(10.5)).toBeTruthy();
    expect(undefinedDecimalsFormatter(10.5)).toContain('$');

    // Locale with underscore to hyphen conversion
    const ptFormatter = usePriceFormatter({
      locale: Locale.pt_PT,
      currency: order.CurrencyCodeEnum.EUR,
      decimals: 2,
    });
    expect(ptFormatter(10.5)).toContain('10,50');
  });

  it('should handle edge cases including large numbers, zero, rounding, and consistency', () => {
    const formatter = usePriceFormatter({
      locale: Locale.en_GB,
      currency: order.CurrencyCodeEnum.USD,
      decimals: 2,
    });

    // Large numbers
    expect(formatter(1234567.89)).toMatch(/\$1,234,567\.89/);

    // Zero value
    expect(formatter(0)).toMatch(/\$0\.00/);

    // Fractional cents rounding
    expect(formatter(10.996)).toMatch(/\$11\.00/);
    expect(formatter(10.994)).toMatch(/\$10\.99/);

    // Consistency check
    const result1 = formatter(99.99);
    const result2 = formatter(99.99);
    expect(result1).toBe(result2);
  });
});
