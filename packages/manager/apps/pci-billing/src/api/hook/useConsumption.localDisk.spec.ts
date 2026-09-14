import { beforeEach, describe, expect, it } from 'vitest';
import { TCurrentUsage, TInstanceUsage } from '../data/consumption';
import { getConsumptionDetails, TConsumptionDetail } from './useConsumption';

const anInstanceUsage = (
  reference: string,
  totalPrice: number,
): TInstanceUsage => ({
  reference,
  region: 'EU-SOUTH-MIL',
  deploymentMode: 'REGION-3-AZ',
  quantity: { unit: 'GiBh', value: 720 },
  totalPrice,
  details: [
    {
      instanceId: 'f15aaf5b-e2c2-4d79-83fa-aa8ac3ac6b33',
      resourceId: 'f15aaf5b-e2c2-4d79-83fa-aa8ac3ac6b33',
      quantity: { unit: 'GiBh', value: 720 },
      totalPrice,
    },
  ],
});

const aUsage = ({
  hourlyInstances = [],
  monthlyInstances = [],
}: {
  hourlyInstances?: TInstanceUsage[];
  monthlyInstances?: TInstanceUsage[];
}): TCurrentUsage => ({
  hourlyUsage: {
    rancher: [],
    quantum: { notebook: [] },
    instance: hourlyInstances,
    instanceBandwidth: [],
    managedKubernetesService: [],
    snapshot: [],
    storage: [],
    volume: [],
    lastUpdate: '',
  },
  lastUpdate: '',
  monthlyUsage: {
    certification: [],
    instance: monthlyInstances,
    savingsPlan: [],
  },
  period: { from: '', to: '' },
  resourcesUsage: [],
  totalPrice: { currencyCode: 'EUR', priceInUcents: 0, text: '', value: 0 },
});

describe.each([
  { reference: 'b3-16', servers: 1, localStorages: 0 },
  { reference: 'win-b3-8', servers: 1, localStorages: 0 },
  { reference: 'b3-16.local-disk-gb', servers: 0, localStorages: 1 },
  { reference: 'c3-8.local-disk-tb', servers: 0, localStorages: 1 },
])(
  'an hourly instance billed as $reference',
  ({ reference, servers, localStorages }) => {
    describe('mapping the current usage', () => {
      let consumption: TConsumptionDetail;

      beforeEach(() => {
        consumption = getConsumptionDetails(
          aUsage({ hourlyInstances: [anInstanceUsage(reference, 3.2)] }),
        );
      });

      it('bills it either as a server or as local storage', () => {
        expect({
          servers: consumption.hourlyInstances.length,
          localStorages: consumption.localStorages.length,
        }).toEqual({ servers, localStorages });
      });
    });
  },
);

describe('a project consuming both servers and local disks', () => {
  describe('mapping the current usage', () => {
    let consumption: TConsumptionDetail;

    beforeEach(() => {
      consumption = getConsumptionDetails(
        aUsage({
          hourlyInstances: [
            anInstanceUsage('b3-16', 3.2),
            anInstanceUsage('b3-16.local-disk-gb', 6.4),
          ],
        }),
      );
    });

    it('keeps the local disk out of the servers rows', () => {
      expect(consumption.hourlyInstances.map((row) => row.reference)).toEqual([
        'b3-16',
      ]);
    });

    it('bills the local disk under local storage', () => {
      expect(consumption.localStorages).toEqual([
        {
          reference: 'b3-16.local-disk-gb',
          region: 'EU-SOUTH-MIL',
          deploymentMode: 'REGION-3-AZ',
          instanceId: 'f15aaf5b-e2c2-4d79-83fa-aa8ac3ac6b33',
          resourceId: 'f15aaf5b-e2c2-4d79-83fa-aa8ac3ac6b33',
          quantity: { unit: 'GiBh', value: 720 },
          totalPrice: 6.4,
        },
      ]);
    });

    it('splits the hourly totals between the two', () => {
      expect({
        instance: consumption.totals.hourly.instance,
        localDisk: consumption.totals.hourly.localDisk,
      }).toEqual({ instance: 3.2, localDisk: 6.4 });
    });
  });
});

describe('a project whose monthly billing carries a local disk', () => {
  describe('mapping the current usage', () => {
    let consumption: TConsumptionDetail;

    beforeEach(() => {
      consumption = getConsumptionDetails(
        aUsage({
          monthlyInstances: [
            anInstanceUsage('b3-16', 3.2),
            anInstanceUsage('b3-16.local-disk-gb', 6.4),
          ],
        }),
      );
    });

    it('keeps the local disk out of the monthly servers rows', () => {
      expect(consumption.monthlyInstances.map((row) => row.reference)).toEqual([
        'b3-16',
      ]);
    });

    it('leaves the local disk out of the monthly total', () => {
      expect(consumption.totals.monthly.instance).toBe(3.2);
    });
  });
});
