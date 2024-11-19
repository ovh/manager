import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  priceToUcent,
  useCatalogPrice,
  HOUR_IN_MONTH,
  convertHourlyPriceToMonthly,
} from './useCatalogPrice';

const mocks = vi.hoisted(() => ({
  useMe: vi.fn(() => ({
    me: {
      ovhSubsidiary: 'FR',
      currency: {
        code: 'EUR',
      },
    },
  })),
  t: vi.fn((key: string) => key),
}));

vi.mock('./useMe', () => ({
  useMe: mocks.useMe,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mocks.t,
    i18n: { exists: () => true, language: 'fr_FR' },
  }),
}));

describe('useCatalogPrice', () => {
  beforeEach(() => {
    mocks.t.mockRestore();
  });

  it('format price with EUR currency', () => {
    const { result } = renderHook(() => useCatalogPrice());
    const textPrice = result.current.getTextPrice(priceToUcent(10));
    expect(textPrice).toBe('10,00 €');
  });

  it('format price with USD currency', () => {
    mocks.useMe.mockReturnValueOnce({
      me: {
        ovhSubsidiary: 'US',
        currency: {
          code: 'USD',
        },
      },
    });
    const { result } = renderHook(() => useCatalogPrice());
    const textPrice = result.current.getTextPrice(priceToUcent(15));
    expect(textPrice).toBe('15,00 $US');
  });

  it('format price with specified digits', () => {
    const { result } = renderHook(() => useCatalogPrice(3));
    const textPrice = result.current.getTextPrice(priceToUcent(10.12345));
    expect(textPrice).toBe('10,123 €');
  });

  it('format rounds price with specified digits', () => {
    const { result } = renderHook(() => useCatalogPrice(1));
    const textPrice = result.current.getTextPrice(priceToUcent(10.15));
    expect(textPrice).toBe('10,2 €');
  });

  it('should display excl tax label', () => {
    const { result } = renderHook(() => useCatalogPrice());
    const formatted = result.current.getFormattedCatalogPrice(priceToUcent(10));
    expect(mocks.t).toHaveBeenCalledWith('order_catalog_price_tax_excl_label', {
      price: '10,00 €',
    });
    expect(formatted).toBe('order_catalog_price_tax_excl_label');
  });

  it('should not display excl tax label for US subsidiary', () => {
    mocks.useMe.mockReturnValueOnce({
      me: {
        ovhSubsidiary: 'US',
        currency: {
          code: 'USD',
        },
      },
    });
    const { result } = renderHook(() => useCatalogPrice());
    const formatted = result.current.getFormattedCatalogPrice(priceToUcent(10));
    expect(mocks.t).not.toHaveBeenCalled();
    expect(formatted).toBe('10,00 $US');
  });

  it('should not display excl tax label for german subsidiary', () => {
    mocks.useMe.mockReturnValueOnce({
      me: {
        ovhSubsidiary: 'DE',
        currency: {
          code: 'EUR',
        },
      },
    });
    const { result } = renderHook(() => useCatalogPrice());
    const formatted = result.current.getFormattedCatalogPrice(priceToUcent(10));
    expect(mocks.t).not.toHaveBeenCalled();
    expect(formatted).toBe('10,00 €');
  });

  it('should not display excl vat label for german subsidiary', () => {
    mocks.useMe.mockReturnValueOnce({
      me: {
        ovhSubsidiary: 'DE',
        currency: {
          code: 'EUR',
        },
      },
    });
    const { result } = renderHook(() => useCatalogPrice(1));
    const textPrice = result.current.getFormattedCatalogPrice(
      priceToUcent(25.152),
    );
    expect(textPrice).toBe('25,2 €');
  });

  it('should format hourly catalog price', () => {
    const { result } = renderHook(() => useCatalogPrice());
    result.current.getFormattedHourlyCatalogPrice(priceToUcent(42));
    expect(mocks.t).toHaveBeenCalledWith('order_catalog_price_interval_hour');
  });

  it('should format monthly catalog price', () => {
    const { result } = renderHook(() => useCatalogPrice());
    result.current.getFormattedMonthlyCatalogPrice(priceToUcent(42));
    expect(mocks.t).toHaveBeenCalledWith('order_catalog_price_interval_month');
  });
});

describe('Pricing Function', () => {
  describe('convertHourlyPriceToMonthly', () => {
    it('should convert hourly price to monthly price', () => {
      expect(convertHourlyPriceToMonthly(1)).toBe(HOUR_IN_MONTH);
      expect(convertHourlyPriceToMonthly(0.5)).toBe(365);
    });
  });
});
