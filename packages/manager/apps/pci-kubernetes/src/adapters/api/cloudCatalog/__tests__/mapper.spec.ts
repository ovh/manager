import { describe, expect, it } from 'vitest';

import { TCloudCatalogResponseDTO } from '../dto.types';
import { mapCloudCatalogToEntity } from '../mapper';

const createMockPricingDTO = (
  price: number = 0,
  tax: number = 0,
): TCloudCatalogResponseDTO['addons'][number]['pricings'][number] => ({
  phase: 1,
  capacities: [],
  commitment: 0,
  description: 'Test pricing',
  interval: 1,
  intervalUnit: 'hour',
  quantity: { min: 1, max: null },
  repeat: { min: 1, max: null },
  price,
  formattedPrice: `${price}`,
  tax,
  mode: 'default',
  strategy: 'strategy',
  mustBeCompleted: false,
  type: 'purchase',
  promotions: [],
  engagementConfiguration: null,
});

const createMockAddonDTO = (
  planCode: string,
  consumptionConfiguration:
    | TCloudCatalogResponseDTO['addons'][number]['consumptionConfiguration']
    | null = null,
): TCloudCatalogResponseDTO['addons'][number] => ({
  planCode,
  invoiceName: 'Test Plan',
  addonFamilies: [],
  product: 'kubernetes',
  pricingType: 'consumption',
  consumptionConfiguration: consumptionConfiguration ?? {
    billingStrategy: 'max',
    prorataUnit: 'second',
    pingEndPolicy: null,
  },
  pricings: [createMockPricingDTO(0.04, 0.008)],
  configurations: [],
  family: null,
});

const createMockDTO = (
  addons: Array<TCloudCatalogResponseDTO['addons'][number]>,
): TCloudCatalogResponseDTO => ({
  catalogId: 123,
  locale: {
    currencyCode: 'EUR',
    subsidiary: 'FR',
    taxRate: 0.2,
  },
  plans: [],
  products: [],
  addons,
  planFamilies: [],
});

describe('mapCloudCatalogToEntity', () => {
  it('filters and maps only addons with planCode in PLAN_CODES', () => {
    const dto = createMockDTO([
      createMockAddonDTO('mks.free.hour.consumption'),
      createMockAddonDTO('mks.standard.hour.consumption'),
      createMockAddonDTO('invalid.plan.code'),
    ]);

    const result = mapCloudCatalogToEntity(dto);

    expect(Object.keys(result.entities.plans)).toHaveLength(2);
    expect(result.entities.plans['mks.free.hour.consumption']).toBeDefined();
    expect(result.entities.plans['mks.standard.hour.consumption']).toBeDefined();
    expect(
      result.entities.plans['invalid.plan.code' as keyof typeof result.entities.plans],
    ).toBeUndefined();
  });

  it('ignores addons with unrecognized planCode', () => {
    const dto = createMockDTO([
      createMockAddonDTO('other.service.plan'),
      createMockAddonDTO('another.invalid.code'),
    ]);

    const result = mapCloudCatalogToEntity(dto);

    expect(Object.keys(result.entities.plans)).toHaveLength(0);
  });

  it('handles empty addons array', () => {
    const dto = createMockDTO([]);

    const result = mapCloudCatalogToEntity(dto);

    expect(Object.keys(result.entities.plans)).toHaveLength(0);
  });

  it('maps all three plan codes correctly', () => {
    const dto = createMockDTO([
      createMockAddonDTO('mks.free.hour.consumption'),
      createMockAddonDTO('mks.standard.hour.consumption'),
      createMockAddonDTO('mks.standard.hour.consumption.3az'),
    ]);

    const result = mapCloudCatalogToEntity(dto);

    expect(Object.keys(result.entities.plans)).toHaveLength(3);
    expect(result.entities.plans['mks.free.hour.consumption']).toBeDefined();
    expect(result.entities.plans['mks.standard.hour.consumption']).toBeDefined();
    expect(result.entities.plans['mks.standard.hour.consumption.3az']).toBeDefined();
  });
});
