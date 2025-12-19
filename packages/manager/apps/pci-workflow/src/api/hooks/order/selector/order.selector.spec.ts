import { describe } from 'vitest';

import { TCatalog, TProductAvailability } from '@ovh-ux/manager-pci-common';

import { getRegionPricing } from '@/api/hooks/order/selector/order.selector';

describe('order selector', () => {
  describe('getRegionPricing', () => {
    it('should get the princing for the snapshot.consumption plan corresponding to the region', () => {
      const region = 'currentRegion';

      const snapshotAvailabilities = {
        plans: [
          {
            code: 'snapshot.consumption.3AZ',
            regions: [{ name: region }],
          },
          {
            code: 'snapshot.consumption',
            regions: [{ name: 'otherRegion' }],
          },
          {
            code: 'volume.snapshot.consumption',
            regions: [{ name: region }],
          },
        ],
      } as TProductAvailability;

      const catalog = {
        addons: [
          {
            planCode: 'snapshot.consumption.3AZ',
            pricings: [
              { intervalUnit: 'month', price: 10500 },
              { intervalUnit: 'hour', price: 2500 },
            ],
          },
          {
            planCode: 'snapshot.consumption',
            pricings: [{ intervalUnit: 'month', price: 20000 }],
          },
        ],
      } as TCatalog;

      const result = getRegionPricing(snapshotAvailabilities, catalog)(region);

      expect(result).toEqual({ intervalUnit: 'hour', price: 2500 });
    });

    it('should return null if no plan correspond to the region', () => {
      const region = 'currentRegion';

      const snapshotAvailabilities = {
        plans: [
          {
            code: 'snapshot.consumption',
            regions: [{ name: 'otherRegion' }],
          },
        ],
      } as TProductAvailability;

      const catalog = {
        addons: [
          {
            planCode: 'snapshot.consumption.3AZ',
            pricings: [
              { intervalUnit: 'month', price: 10500 },
              { intervalUnit: 'hour', price: 2500 },
            ],
          },
          {
            planCode: 'snapshot.consumption',
            pricings: [{ intervalUnit: 'month', price: 20000 }],
          },
        ],
      } as TCatalog;

      const result = getRegionPricing(snapshotAvailabilities, catalog)(region);

      expect(result).toBeNull();
    });

    it('should return null if no pricing correspond to plan', () => {
      const region = 'currentRegion';

      const snapshotAvailabilities = {
        plans: [
          {
            code: 'snapshot.consumption.3AZ',
            regions: [{ name: region }],
          },
          {
            code: 'snapshot.consumption',
            regions: [{ name: 'otherRegion' }],
          },
          {
            code: 'volume.snapshot.consumption',
            regions: [{ name: region }],
          },
        ],
      } as TProductAvailability;

      const catalog = {
        addons: [
          {
            planCode: 'snapshot.consumption',
            pricings: [{ intervalUnit: 'month', price: 20000 }],
          },
        ],
      } as TCatalog;

      const result = getRegionPricing(snapshotAvailabilities, catalog)(region);

      expect(result).toBeNull();
    });
  });
});
