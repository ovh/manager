import { describe, expect, it } from 'vitest';
import { TCurrentUsage } from '../data/consumption';
import { getConsumptionDetails } from './useConsumption';

const buildUsage = (
  resourcesUsage: TCurrentUsage['resourcesUsage'],
): TCurrentUsage =>
  (({
    hourlyUsage: {
      instance: [],
      instanceBandwidth: [],
      storage: [],
      snapshot: [],
      volume: [],
      rancher: [],
      managedKubernetesService: [],
      quantum: { notebook: [] },
    },
    monthlyUsage: { instance: [], savingsPlan: [], certification: [] },
    resourcesUsage,
    totalPrice: {
      value: 2.16,
      currencyCode: 'EUR',
      priceInUcents: 0,
      text: '',
    },
    period: { from: '', to: '' },
    lastUpdate: '',
  } as unknown) as TCurrentUsage);

const shareEntry = {
  type: 'share',
  totalPrice: 1.6587,
  resources: [
    {
      region: 'WAW1',
      components: [
        {
          id: 'share.5e18e53b.77402726',
          name: 'share',
          resourceId: '77402726-715c-4531-a1e1-7de5292bec4c',
          quantity: { unit: 'Hour', value: 8550 },
          totalPrice: 1.6587,
        },
      ],
    },
  ],
};

const shareSnapshotEntry = {
  type: 'shareSnapshot',
  totalPrice: 0.5,
  resources: [
    {
      region: 'GRA9',
      components: [
        {
          id: 'shareSnapshot.abc.def',
          name: 'shareSnapshot',
          resourceId: 'abc-123',
          quantity: { unit: 'Hour', value: 100 },
          totalPrice: 0.5,
        },
      ],
    },
  ],
};

describe('getConsumptionDetails - file storage', () => {
  it('maps the "share" resourcesUsage entry to shares', () => {
    const detail = getConsumptionDetails(
      buildUsage([shareEntry] as TCurrentUsage['resourcesUsage']),
    );

    expect(detail.shares).toHaveLength(1);
    expect(detail.shares[0]).toMatchObject({
      name: 'share',
      region: 'WAW1',
      resourceId: '77402726-715c-4531-a1e1-7de5292bec4c',
      totalPrice: 1.6587,
    });
    expect(detail.totals.hourly.share).toBe(1.66);
  });

  it('maps the "shareSnapshot" resourcesUsage entry to shareSnapshots', () => {
    const detail = getConsumptionDetails(
      buildUsage([shareSnapshotEntry] as TCurrentUsage['resourcesUsage']),
    );

    expect(detail.shareSnapshots).toHaveLength(1);
    expect(detail.shareSnapshots[0]).toMatchObject({
      name: 'shareSnapshot',
      region: 'GRA9',
      resourceId: 'abc-123',
      totalPrice: 0.5,
    });
    expect(detail.totals.hourly.shareSnapshot).toBe(0.5);
  });

  it('returns empty lists when there is no share consumption', () => {
    const detail = getConsumptionDetails(buildUsage([]));

    expect(detail.shares).toEqual([]);
    expect(detail.shareSnapshots).toEqual([]);
  });
});
