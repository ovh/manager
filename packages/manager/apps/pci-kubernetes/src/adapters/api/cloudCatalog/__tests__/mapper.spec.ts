import { describe, expect, it } from 'vitest';

import {
  TCloudCatalogAddonDTO,
  TCloudCatalogPricingDTO,
  TCloudCatalogResponseDTO,
} from '../dto.types';
import { mapCloudCatalogToEntity } from '../mapper';

const createMockPricingDTO = (price: number = 0, tax: number = 0) =>
  ({
    price,
    formattedPrice: `${price}`,
    tax,
  }) as unknown as TCloudCatalogPricingDTO;

const createMockAddonDTO = (planCode: string) =>
  ({
    planCode,
    invoiceName: 'Test Plan',
    addonFamilies: [],
    product: 'kubernetes',
    pricings: [createMockPricingDTO(0.04, 0.008)],
  }) as unknown as TCloudCatalogAddonDTO;

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
