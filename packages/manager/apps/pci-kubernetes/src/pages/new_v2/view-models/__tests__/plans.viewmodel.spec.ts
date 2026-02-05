import { describe, expect, it, vi } from 'vitest';

import {
  TCloudCatalog,
  TCloudCatalogPlan,
  TCloudCatalogPricing,
} from '@/domain/entities/cloudCatalog';
import { TMacroRegion, TRegions } from '@/domain/entities/regions';

import { selectPlanPrices, selectPlansFromCatalog, selectRegionPlanType } from '../plans.viewmodel';

vi.mock('@ovh-ux/muk', () => ({
  convertHourlyPriceToMonthly: vi.fn((price: number) => price * 730),
}));

describe('plans.viewmodel', () => {
  const createMockPricing = (price: number, tax: number = 0): TCloudCatalogPricing => ({
    phase: 1,
    capacities: [],
    commitment: 0,
    description: 'Test pricing',
    interval: 1,
    intervalUnit: 'hour',
    price,
    formattedPrice: `${price}`,
    tax,
    mode: 'default',
    strategy: 'strategy',
    mustBeCompleted: false,
    type: 'purchase',
  });

  const createMockPlan = (
    planCode: string,
    price: number = 0,
    tax: number = 0,
  ): TCloudCatalogPlan => ({
    planCode,
    invoiceName: 'Test Plan',
    product: 'kubernetes',
    pricingType: 'consumption',
    consumptionConfiguration: null,
    pricings: [createMockPricing(price, tax)],
  });

  const createMockCatalog = (
    plans: Array<{ planCode: string; price: number; tax: number }>,
  ): TCloudCatalog => {
    const plansMap: TCloudCatalog['entities']['plans'] = {};
    plans.forEach((plan) => {
      plansMap[plan.planCode as keyof typeof plansMap] = createMockPlan(
        plan.planCode,
        plan.price,
        plan.tax,
      );
    });
    return {
      entities: {
        plans: plansMap,
      },
    };
  };

  const createMockRegions = (macroRegions: Array<TMacroRegion>): TRegions => ({
    entities: {
      macroRegions: {
        byId: new Map(macroRegions.map((region) => [region.name, region])),
        allIds: macroRegions.map((region) => region.name),
      },
      microRegions: {
        byId: new Map(),
        allIds: [],
      },
    },
    relations: {
      planRegions: {},
    },
  });

  const createMockMacroRegion = (name: string, plans: Array<string>): TMacroRegion => ({
    name,
    countryCode: 'fr',
    continentCode: 'EU',
    microRegionIds: [`${name}1`],
    plans: plans as Array<TMacroRegion['plans'][number]>,
    enabled: true,
  });

  describe('selectPlansFromCatalog', () => {
    it('returns empty array when catalog is undefined', () => {
      const selector = selectPlansFromCatalog(false);
      const result = selector(undefined);

      expect(result).toEqual([]);
    });

    it('returns 2 plans in single-zone mode', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.standard.hour.consumption', price: 0.04, tax: 0.008 },
        { planCode: 'mks.free.hour.consumption', price: 0, tax: 0 },
      ]);

      const selector = selectPlansFromCatalog(false);
      const result = selector(catalog);

      expect(result).toHaveLength(2);
      expect(result[0]?.code).toBe('mks.standard.hour.consumption');
      expect(result[0]?.planType).toBe('standard');
      expect(result[1]?.code).toBe('mks.free.hour.consumption');
      expect(result[1]?.planType).toBe('free');
    });

    it('returns 2 plans in multi-zone mode', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.standard.hour.consumption.3az', price: 0.12, tax: 0.024 },
        { planCode: 'mks.free.hour.consumption.3az', price: 0, tax: 0 },
      ]);

      const selector = selectPlansFromCatalog(true);
      const result = selector(catalog);

      expect(result).toHaveLength(2);
      expect(result[0]?.code).toBe('mks.standard.hour.consumption.3az');
      expect(result[0]?.planType).toBe('standard');
      expect(result[1]?.code).toBe('mks.free.hour.consumption.3az');
      expect(result[1]?.planType).toBe('free');
    });

    it('calculates prices correctly', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.standard.hour.consumption', price: 0.04, tax: 0.008 },
      ]);

      const selector = selectPlansFromCatalog(false);
      const result = selector(catalog);

      expect(result[0]?.price).toEqual({
        priceExclVat: 0.04 * 730,
        priceInclVat: (0.04 + 0.008) * 730,
      });
    });

    it('marks plans as disabled when regionPlanTypes provided and planType not included', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.standard.hour.consumption', price: 0.04, tax: 0.008 },
        { planCode: 'mks.free.hour.consumption', price: 0, tax: 0 },
      ]);

      const selector = selectPlansFromCatalog(false, ['free']);
      const result = selector(catalog);

      expect(result[0]?.disabled).toBe(true);
      expect(result[1]?.disabled).toBe(false);
    });

    it('does not mark plans as disabled by default when no regionPlanTypes', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.standard.hour.consumption', price: 0.04, tax: 0.008 },
        { planCode: 'mks.free.hour.consumption', price: 0, tax: 0 },
      ]);

      const selector = selectPlansFromCatalog(false);
      const result = selector(catalog);

      expect(result[0]?.disabled).toBe(false);
      expect(result[1]?.disabled).toBe(false);
    });

    it('returns null price when plan not found in catalog', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.free.hour.consumption', price: 0, tax: 0 },
      ]);

      const selector = selectPlansFromCatalog(false);
      const result = selector(catalog);

      expect(result[0]?.price).toBeNull();
    });
  });

  describe('selectPlanPrices', () => {
    it('returns null when catalog is undefined', () => {
      const selector = selectPlanPrices(false, 'standard');
      const result = selector(undefined);

      expect(result).toBeNull();
    });

    it('returns null when plan not found in catalog', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.free.hour.consumption', price: 0, tax: 0 },
      ]);

      const selector = selectPlanPrices(false, 'standard');
      const result = selector(catalog);

      expect(result).toBeNull();
    });

    it('uses mks.standard.hour.consumption for standard planType in single-zone', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.standard.hour.consumption', price: 0.04, tax: 0.008 },
      ]);

      const selector = selectPlanPrices(false, 'standard');
      const result = selector(catalog);

      expect(result).toEqual({
        hourlyPrice: 0.04,
        hourlyTax: 0.008,
      });
    });

    it('uses mks.standard.hour.consumption.3az for standard planType in multi-zone', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.standard.hour.consumption.3az', price: 0.12, tax: 0.024 },
      ]);

      const selector = selectPlanPrices(true, 'standard');
      const result = selector(catalog);

      expect(result).toEqual({
        hourlyPrice: 0.12,
        hourlyTax: 0.024,
      });
    });

    it('uses mks.free.hour.consumption for free planType regardless of zone', () => {
      const catalog = createMockCatalog([
        { planCode: 'mks.free.hour.consumption', price: 0, tax: 0 },
      ]);

      const selectorSingleZone = selectPlanPrices(false, 'free');
      const resultSingleZone = selectorSingleZone(catalog);

      const selectorMultiZone = selectPlanPrices(true, 'free');
      const resultMultiZone = selectorMultiZone(catalog);

      expect(resultSingleZone).toEqual({
        hourlyPrice: 0,
        hourlyTax: 0,
      });
      expect(resultMultiZone).toEqual({
        hourlyPrice: 0,
        hourlyTax: 0,
      });
    });
  });

  describe('selectRegionPlanType', () => {
    it('returns empty array when regions is undefined', () => {
      const selector = selectRegionPlanType('GRA');
      const result = selector(undefined);

      expect(result).toEqual([]);
    });

    it('returns empty array when macroRegion not found', () => {
      const regions = createMockRegions([
        createMockMacroRegion('BHS', ['mks.free.hour.consumption']),
      ]);

      const selector = selectRegionPlanType('GRA');
      const result = selector(regions);

      expect(result).toEqual([]);
    });

    it.each([
      {
        planCode: 'mks.standard.hour.consumption',
        expectedPlanType: 'standard',
      },
      {
        planCode: 'mks.standard.hour.consumption.3az',
        expectedPlanType: 'standard',
      },
      {
        planCode: 'mks.free.hour.consumption',
        expectedPlanType: 'free',
      },
    ])('maps $planCode to $expectedPlanType', ({ planCode, expectedPlanType }) => {
      const regions = createMockRegions([createMockMacroRegion('GRA', [planCode])]);

      const selector = selectRegionPlanType('GRA');
      const result = selector(regions);

      expect(result).toEqual([expectedPlanType]);
    });

    it('handles region with multiple plans', () => {
      const regions = createMockRegions([
        createMockMacroRegion('GRA', [
          'mks.free.hour.consumption',
          'mks.standard.hour.consumption',
          'mks.standard.hour.consumption.3az',
        ]),
      ]);

      const selector = selectRegionPlanType('GRA');
      const result = selector(regions);

      expect(result).toEqual(['free', 'standard', 'standard']);
    });
  });
});
