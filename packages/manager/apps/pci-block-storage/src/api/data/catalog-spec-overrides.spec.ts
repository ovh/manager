// SPDX-License-Identifier: BSD-3-Clause
// Copyright (c) OVH SAS

import { describe, expect, it } from 'vitest';
import { applyHardcodedSpecOverrides } from './catalog-spec-overrides';
import { TVolumeCatalog, TVolumePricing } from './catalog';

const makePricing = (
  overrides: Partial<TVolumePricing['specs']['volume']['iops']> = {},
  bandwidthOverrides: Partial<
    NonNullable<TVolumePricing['specs']['bandwidth']>
  > | null = {},
): TVolumePricing =>
  ({
    price: 0,
    regions: [],
    showAvailabilityZones: false,
    interval: 'hour',
    areIOPSDynamic: true,
    isBandwidthDynamic: true,
    specs: {
      name: 'spec',
      maxAttachedInstances: 1,
      bandwidth:
        bandwidthOverrides === null
          ? null
          : {
              guaranteed: false,
              level: 1,
              max: 1000,
              ...bandwidthOverrides,
            },
      volume: {
        iops: {
          level: 1,
          max: 10000,
          guaranteed: false,
          unit: 'u',
          maxUnit: 'u',
          ...overrides,
        },
        capacity: { max: 4000 },
      },
    },
  } as TVolumePricing);

const makeCatalog = (
  modelName: string,
  pricings: TVolumePricing[],
): TVolumeCatalog =>
  (({
    filters: { deployment: [], region: [] },
    regions: [],
    models: [
      {
        name: modelName,
        tags: [],
        filters: {},
        pricings,
      },
    ],
  } as unknown) as TVolumeCatalog);

describe('applyHardcodedSpecOverrides', () => {
  it('injects iops min and bandwidth min on high-speed-gen2 when not guaranteed', () => {
    const catalog = makeCatalog('high-speed-gen2', [makePricing()]);

    const result = applyHardcodedSpecOverrides(catalog);

    const pricing = result.models[0].pricings[0];
    expect(pricing.specs.volume.iops.min).toBe(3000);
    expect(pricing.specs.bandwidth?.min).toBe(50);
  });

  it('injects iops min and bandwidth min on high-speed-gen2-luks when not guaranteed', () => {
    const catalog = makeCatalog('high-speed-gen2-luks', [makePricing()]);

    const result = applyHardcodedSpecOverrides(catalog);

    const pricing = result.models[0].pricings[0];
    expect(pricing.specs.volume.iops.min).toBe(3000);
    expect(pricing.specs.bandwidth?.min).toBe(50);
  });

  it('does not override iops or bandwidth when the spec is guaranteed', () => {
    const catalog = makeCatalog('high-speed-gen2', [
      makePricing({ guaranteed: true }, { guaranteed: true }),
    ]);

    const result = applyHardcodedSpecOverrides(catalog);

    const pricing = result.models[0].pricings[0];
    expect(pricing.specs.volume.iops.min).toBeUndefined();
    expect(pricing.specs.bandwidth?.min).toBeUndefined();
  });

  it('does not override when the API already returned a positive min', () => {
    const catalog = makeCatalog('high-speed-gen2', [
      makePricing({ min: 9999 }, { min: 999 }),
    ]);

    const result = applyHardcodedSpecOverrides(catalog);

    const pricing = result.models[0].pricings[0];
    expect(pricing.specs.volume.iops.min).toBe(9999);
    expect(pricing.specs.bandwidth?.min).toBe(999);
  });

  it('overrides when the API returned a non-positive min (0 or null)', () => {
    const catalog = makeCatalog('high-speed-gen2', [
      makePricing({ min: 0 }, { min: null }),
    ]);

    const result = applyHardcodedSpecOverrides(catalog);

    const pricing = result.models[0].pricings[0];
    expect(pricing.specs.volume.iops.min).toBe(3000);
    expect(pricing.specs.bandwidth?.min).toBe(50);
  });

  it('leaves non-overridden models untouched', () => {
    const catalog = makeCatalog('classic', [makePricing()]);

    const result = applyHardcodedSpecOverrides(catalog);

    const pricing = result.models[0].pricings[0];
    expect(pricing.specs.volume.iops.min).toBeUndefined();
    expect(pricing.specs.bandwidth?.min).toBeUndefined();
  });

  it('handles a null bandwidth spec without throwing', () => {
    const catalog = makeCatalog('high-speed-gen2', [makePricing({}, null)]);

    const result = applyHardcodedSpecOverrides(catalog);

    const pricing = result.models[0].pricings[0];
    expect(pricing.specs.volume.iops.min).toBe(3000);
    expect(pricing.specs.bandwidth).toBeNull();
  });
});
