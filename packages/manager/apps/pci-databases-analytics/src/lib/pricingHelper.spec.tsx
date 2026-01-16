import { describe, vi, it, expect } from 'vitest';
import { computeServicePrice, usePriceFormatter } from '@/lib/pricingHelper';
import * as database from '@/types/cloud/project/database';
import { mockedPricing } from '../__tests__/helpers/mocks/order-funnel';
import { order } from '@/types/catalog';
import { Locale } from '@/hooks/useLocale';

const mockedPricingHelper = {
  offerPricing: mockedPricing,
  nbNodes: 2,
  storagePricing: mockedPricing,
  additionalStorage: 2,
};

describe('pricingHelper', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('computeServicePriceWithDistributed', () => {
    const mockedDistributedPricing = {
      ...mockedPricingHelper,
      storageMode:
        database.capabilities.engine.storage.StrategyEnum.distributed,
    };
    const pricing = computeServicePrice(mockedDistributedPricing).servicePrice;
    expect(pricing).toStrictEqual({
      price: 4,
      tax: 4,
    });
  });

  it('computeServicePriceWithReplicated', () => {
    const mockedReplicatedPricing = {
      ...mockedPricingHelper,
      storageMode: database.capabilities.engine.storage.StrategyEnum.replicated,
    };
    const pricing = computeServicePrice(mockedReplicatedPricing).servicePrice;
    expect(pricing).toStrictEqual({
      price: 6,
      tax: 6,
    });
  });

  describe('usePriceFormatter', () => {
    it('should format price with USD currency and en_GB locale', () => {
      const formatter = usePriceFormatter({
        locale: Locale.en_GB,
        currency: order.CurrencyCodeEnum.USD,
        decimals: 2,
      });

      expect(formatter(10.5)).toMatch(/\$10\.50/);
    });

    it('should format price with EUR currency and fr_FR locale', () => {
      const formatter = usePriceFormatter({
        locale: Locale.fr_FR,
        currency: order.CurrencyCodeEnum.EUR,
        decimals: 2,
      });

      expect(formatter(10.5)).toMatch(/10,50\s*€/);
    });

    it('should format price with GBP currency and en_GB locale', () => {
      const formatter = usePriceFormatter({
        locale: Locale.en_GB,
        currency: order.CurrencyCodeEnum.GBP,
        decimals: 2,
      });

      expect(formatter(10.5)).toMatch(/£10\.50/);
    });

    it('should handle zero decimals', () => {
      const formatter = usePriceFormatter({
        locale: Locale.en_GB,
        currency: order.CurrencyCodeEnum.USD,
        decimals: 0,
      });

      expect(formatter(10.5)).toMatch(/\$11/);
      expect(formatter(10.5)).not.toMatch(/\./);
    });

    it('should handle three decimals', () => {
      const formatter = usePriceFormatter({
        locale: Locale.en_GB,
        currency: order.CurrencyCodeEnum.USD,
        decimals: 3,
      });

      expect(formatter(10.567)).toMatch(/\$10\.567/);
    });

    it('should format large numbers correctly', () => {
      const formatter = usePriceFormatter({
        locale: Locale.en_GB,
        currency: order.CurrencyCodeEnum.USD,
        decimals: 2,
      });

      expect(formatter(1234567.89)).toMatch(/\$1,234,567\.89/);
    });

    it('should format zero correctly', () => {
      const formatter = usePriceFormatter({
        locale: Locale.en_GB,
        currency: order.CurrencyCodeEnum.USD,
        decimals: 2,
      });

      expect(formatter(0)).toMatch(/\$0\.00/);
    });

    it('should handle undefined decimals parameter', () => {
      const formatter = usePriceFormatter({
        locale: Locale.en_GB,
        currency: order.CurrencyCodeEnum.USD,
      });

      expect(formatter(10.5)).toBeTruthy();
      expect(formatter(10.5)).toContain('$');
    });

    it('should replace underscore with hyphen in locale', () => {
      const formatter = usePriceFormatter({
        locale: Locale.pt_PT,
        currency: order.CurrencyCodeEnum.EUR,
        decimals: 2,
      });

      expect(formatter(10.5)).toContain('10,50');
    });

    it('should return consistent results for the same value', () => {
      const formatter = usePriceFormatter({
        locale: Locale.en_GB,
        currency: order.CurrencyCodeEnum.USD,
        decimals: 2,
      });

      const result1 = formatter(99.99);
      const result2 = formatter(99.99);

      expect(result1).toBe(result2);
    });

    it('should format fractional cents correctly', () => {
      const formatter = usePriceFormatter({
        locale: Locale.en_GB,
        currency: order.CurrencyCodeEnum.USD,
        decimals: 2,
      });

      expect(formatter(10.996)).toMatch(/\$11\.00/);
      expect(formatter(10.994)).toMatch(/\$10\.99/);
    });
  });
});
