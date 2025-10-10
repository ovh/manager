import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCatalogPrice } from '../useCatalogPrice';
import { priceToUcent, convertHourlyPriceToMonthly } from '../useCatalog.utils';

const mocks = vi.hoisted(() => ({
  useMe: vi.fn(() => ({
    me: {
      ovhSubsidiary: 'FR',
      currency: {
        code: 'EUR',
      },
    },
  })),
  t: vi.fn((key: string, options?: Record<string, unknown>) => {
    if (options?.price) {
      return `${key} ${options.price}`;
    }
    return key;
  }),
}));

vi.mock('../../me', () => ({
  useMe: mocks.useMe,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mocks.t,
    i18n: { exists: () => true, language: 'fr_FR' },
  }),
}));

describe('useCatalogPrice Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTextPrice', () => {
    it('should format price with EUR currency', () => {
      const { result } = renderHook(() => useCatalogPrice());
      const textPrice = result.current.getTextPrice(priceToUcent(10));

      expect(textPrice).toContain('10,00');
      expect(textPrice).toContain('€');
    });

    it('should format price with USD currency for US subsidiary', () => {
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

      expect(textPrice).toContain('15,00');
      expect(textPrice).toContain('$US');
    });

    it('should format price with custom maximum fraction digits', () => {
      const { result } = renderHook(() => useCatalogPrice(3));
      const textPrice = result.current.getTextPrice(priceToUcent(10.12345));

      expect(textPrice).toContain('10,123');
      expect(textPrice).toContain('€');
    });

    it('should round price with specified digits', () => {
      const { result } = renderHook(() => useCatalogPrice(1));
      const textPrice = result.current.getTextPrice(priceToUcent(10.15));

      expect(textPrice).toContain('10,2');
      expect(textPrice).toContain('€');
    });

    it('should return empty string when me is not available', () => {
      mocks.useMe.mockReturnValueOnce({ me: null });

      const { result } = renderHook(() => useCatalogPrice());
      const textPrice = result.current.getTextPrice(priceToUcent(10));

      expect(textPrice).toBe('');
    });
  });

  describe('getFormattedCatalogPrice', () => {
    it('should display tax excl label for French subsidiary', () => {
      const { result } = renderHook(() => useCatalogPrice());
      const formatted = result.current.getFormattedCatalogPrice(
        priceToUcent(10),
      );

      expect(mocks.t).toHaveBeenCalledWith(
        'order_catalog_price_tax_excl_label',
        expect.objectContaining({
          price: expect.stringContaining('10,00'),
        }),
      );
      expect(formatted).toContain('order_catalog_price_tax_excl_label');
    });

    it('should not display tax label for US subsidiary', () => {
      mocks.useMe.mockReturnValueOnce({
        me: {
          ovhSubsidiary: 'US',
          currency: {
            code: 'USD',
          },
        },
      });

      const { result } = renderHook(() => useCatalogPrice());
      const formatted = result.current.getFormattedCatalogPrice(
        priceToUcent(10),
      );

      expect(formatted).toContain('10,00');
      expect(formatted).toContain('$US');
    });

    it('should not display tax label for German subsidiary', () => {
      mocks.useMe.mockReturnValueOnce({
        me: {
          ovhSubsidiary: 'DE',
          currency: {
            code: 'EUR',
          },
        },
      });

      const { result } = renderHook(() => useCatalogPrice());
      const formatted = result.current.getFormattedCatalogPrice(
        priceToUcent(10),
      );

      expect(formatted).toContain('10,00');
      expect(formatted).toContain('€');
    });

    it('should hide tax label when hideTaxLabel option is true', () => {
      const { result } = renderHook(() =>
        useCatalogPrice(undefined, { hideTaxLabel: true }),
      );
      const formatted = result.current.getFormattedCatalogPrice(
        priceToUcent(10),
      );

      expect(formatted).toContain('10,00');
      expect(formatted).toContain('€');
    });

    it('should display tax label when exclVat option is true', () => {
      mocks.useMe.mockReturnValueOnce({
        me: {
          ovhSubsidiary: 'US',
          currency: {
            code: 'USD',
          },
        },
      });

      const { result } = renderHook(() =>
        useCatalogPrice(undefined, { exclVat: true }),
      );
      const formatted = result.current.getFormattedCatalogPrice(
        priceToUcent(10),
      );

      expect(mocks.t).toHaveBeenCalledWith(
        'order_catalog_price_tax_excl_label',
        expect.objectContaining({
          price: expect.stringContaining('10,00'),
        }),
      );
    });
  });

  describe('getFormattedHourlyCatalogPrice', () => {
    it('should format hourly catalog price with interval', () => {
      const { result } = renderHook(() => useCatalogPrice());
      const formatted = result.current.getFormattedHourlyCatalogPrice(
        priceToUcent(5),
      );

      expect(mocks.t).toHaveBeenCalledWith('order_catalog_price_interval_hour');
      expect(formatted).toContain('order_catalog_price_interval_hour');
    });
  });

  describe('getFormattedMonthlyCatalogPrice', () => {
    it('should format monthly catalog price with interval', () => {
      const { result } = renderHook(() => useCatalogPrice());
      const formatted = result.current.getFormattedMonthlyCatalogPrice(
        priceToUcent(50),
      );

      expect(mocks.t).toHaveBeenCalledWith(
        'order_catalog_price_interval_month',
      );
      expect(formatted).toContain('order_catalog_price_interval_month');
    });
  });
});

describe('Utility Functions', () => {
  describe('priceToUcent', () => {
    it('should convert price to ucent', () => {
      expect(priceToUcent(1)).toBe(100_000_000);
      expect(priceToUcent(10)).toBe(1_000_000_000);
      expect(priceToUcent(0.5)).toBe(50_000_000);
    });
  });

  describe('convertHourlyPriceToMonthly', () => {
    it('should convert hourly price to monthly price', () => {
      expect(convertHourlyPriceToMonthly(1)).toBe(730);
      expect(convertHourlyPriceToMonthly(2)).toBe(1460);
      expect(convertHourlyPriceToMonthly(0.5)).toBe(365);
    });
  });
});
