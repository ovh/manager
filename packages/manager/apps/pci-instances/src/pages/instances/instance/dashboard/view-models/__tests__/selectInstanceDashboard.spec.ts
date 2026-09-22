import { beforeEach, describe, expect, it } from 'vitest';
import { selectInstanceDashboard } from '../selectInstanceDashboard';
import {
  TInstance,
  TInstanceDisk,
  TInstanceFlavor,
  TInstancePrice,
} from '@/types/instance/entity.type';
import { TPriceType } from '@/types/instance/common.type';

const urls = { projectUrl: 'project-url', dedicatedUrl: 'dedicated-url' };

const pricing = (
  type: TPriceType,
  priceInUcents: number | null,
  status: TInstancePrice['status'] = 'enabled',
): TInstancePrice => ({
  type,
  status,
  includeVat: false,
  currencyCode: priceInUcents === null ? null : 'EUR',
  priceInUcents,
  text: priceInUcents === null ? null : `${priceInUcents / 10 ** 8} €`,
  value: priceInUcents === null ? null : priceInUcents / 10 ** 8,
});

const instanceBilledOn = (pricings: TInstancePrice[]): TInstance =>
  ({
    id: 'instance-id',
    name: 'instance-name',
    quantity: 1,
    region: { name: 'GRA11', type: 'region', availabilityZone: null },
    volumes: null,
    addresses: new Map(),
    task: { isPending: false, status: null },
    actions: [],
    status: 'ACTIVE',
    flavor: null,
    pricings,
    image: null,
    backups: null,
    sshKey: null,
    login: null,
  } as TInstance);

const instanceRow = (type: TPriceType, value: number | null) => ({
  label: 'instance',
  type,
  value,
});

const licenceRow = (type: TPriceType, value: number | null) => ({
  label: 'licence',
  type,
  value,
});

const localStorageRow = (value: number | null) => ({
  label: 'local_storage',
  type: 'localDisk',
  value,
});

describe.each`
  given                                                     | pricings                                                                   | isStoragePriceDisplayed | expectedRows
  ${'nothing priced'}                                       | ${[]}                                                                      | ${true}                 | ${[]}
  ${'an hourly instance price'}                             | ${[pricing('hour', 10200000)]}                                             | ${false}                | ${[instanceRow('hour', 10200000)]}
  ${'an hourly price and a free local disk'}                | ${[pricing('hour', 10200000), pricing('localDisk', 0)]}                    | ${false}                | ${[instanceRow('hour', 10200000)]}
  ${'an hourly price and a free local disk, storage shown'} | ${[pricing('hour', 10200000), pricing('localDisk', 0)]}                    | ${true}                 | ${[instanceRow('hour', 10200000), localStorageRow(0)]}
  ${'a priced local disk, storage shown'}                   | ${[pricing('hour', 10200000), pricing('localDisk', 200000)]}               | ${true}                 | ${[instanceRow('hour', 10200000), localStorageRow(200000)]}
  ${'a local disk the api prices with nothing'}             | ${[pricing('localDisk', null)]}                                            | ${true}                 | ${[localStorageRow(null)]}
  ${'a monthly price and a licence'}                        | ${[pricing('month', 16640000000), pricing('licence', 6940000)]}            | ${true}                 | ${[instanceRow('month', 16640000000), licenceRow('licence', 6940000)]}
  ${'a monthly licence'}                                    | ${[pricing('licenceMonth', 500000000)]}                                    | ${true}                 | ${[licenceRow('licenceMonth', 500000000)]}
  ${'an active savings plan'}                               | ${[pricing('hour', 10200000), pricing('savingplans', 8000000)]}            | ${true}                 | ${[instanceRow('hour', 10200000)]}
  ${'a price the instance is not billed on'}                | ${[pricing('hour', 10200000), pricing('month', 16640000000, 'available')]} | ${true}                 | ${[instanceRow('hour', 10200000)]}
  ${'a price type the frontend does not know'}              | ${[pricing('hour', 10200000), pricing('reservation' as TPriceType, 100)]}  | ${true}                 | ${[instanceRow('hour', 10200000)]}
`(
  'given an instance billed on $given',
  ({
    pricings,
    isStoragePriceDisplayed,
    expectedRows,
  }: {
    pricings: TInstancePrice[];
    isStoragePriceDisplayed: boolean;
    expectedRows: unknown[];
  }) => {
    describe('when selecting its dashboard view model', () => {
      let rows: unknown;

      beforeEach(() => {
        rows = selectInstanceDashboard(
          urls,
          'en-GB',
          {
            hasRepricing: isStoragePriceDisplayed,
            publicIpPrices: null,
            gatewayPrice: null,
            subnetIdsWithGateway: [],
            catalogDisks: null,
          },
          instanceBilledOn(pricings),
        )?.pricings;
      });

      it('lists one labelled row per price it is billed on', () => {
        expect(rows).toStrictEqual(expectedRows);
      });
    });
  },
);

const PUBLIC_IP_PRICES = { basicPublicIp: 200, floatingIp: 300 };
const GATEWAY_PRICE = 700;

const addressOn = (subnetId?: string) => ({
  ip: '10.0.0.1',
  version: 4,
  subnet: subnetId
    ? {
        id: subnetId,
        name: 'subnet',
        gatewayIP: '10.0.0.254',
        network: { id: 'network-id', name: 'network' },
      }
    : null,
});

const instanceReachableThrough = (
  addresses: [string, ReturnType<typeof addressOn>[]][],
): TInstance => ({
  ...instanceBilledOn([]),
  addresses: new Map(addresses) as TInstance['addresses'],
});

const publicIpRow = (value: number) => ({
  label: 'public_ip',
  type: 'hour',
  value,
});

const floatingIpRow = (value: number) => ({
  label: 'floating_ip',
  type: 'hour',
  value,
});

const gatewayPublicIpRow = (value: number) => ({
  label: 'gateway_public_ip',
  type: 'hour',
  value,
});

const gatewayRow = (value: number) => ({
  label: 'gateway',
  type: 'hour',
  value,
});

describe.each`
  given                                        | addresses                                 | hasRepricing | publicIpPrices      | subnetIdsWithGateway | expectedRows
  ${'no address at all'}                       | ${[]}                                     | ${true}      | ${PUBLIC_IP_PRICES} | ${[]}                | ${[]}
  ${'a basic public IP'}                       | ${[['public', [addressOn()]]]}            | ${true}      | ${PUBLIC_IP_PRICES} | ${[]}                | ${[publicIpRow(200)]}
  ${'a floating IP'}                           | ${[['floating', [addressOn()]]]}          | ${true}      | ${PUBLIC_IP_PRICES} | ${[]}                | ${[floatingIpRow(300)]}
  ${'a private network behind a gateway'}      | ${[['private', [addressOn('subnet-1')]]]} | ${true}      | ${PUBLIC_IP_PRICES} | ${['subnet-1']}      | ${[gatewayRow(700), gatewayPublicIpRow(200)]}
  ${'a private network free of gateway'}       | ${[['private', [addressOn('subnet-1')]]]} | ${true}      | ${PUBLIC_IP_PRICES} | ${['subnet-2']}      | ${[]}
  ${'a public IP and a gateway'} | ${[
  ['public', [addressOn()]],
  ['private', [addressOn('subnet-1')]],
]} | ${true} | ${PUBLIC_IP_PRICES} | ${['subnet-1']} | ${[publicIpRow(200), gatewayRow(700), gatewayPublicIpRow(200)]}
  ${'a public IP, repricing unavailable'}      | ${[['public', [addressOn()]]]}            | ${false}     | ${PUBLIC_IP_PRICES} | ${[]}                | ${[]}
  ${'a public IP, catalog prices unavailable'} | ${[['public', [addressOn()]]]}            | ${true}      | ${null}             | ${[]}                | ${[]}
`(
  'given an instance reachable through $given',
  ({
    addresses,
    hasRepricing,
    publicIpPrices,
    subnetIdsWithGateway,
    expectedRows,
  }: {
    addresses: [string, ReturnType<typeof addressOn>[]][];
    hasRepricing: boolean;
    publicIpPrices: { basicPublicIp: number; floatingIp: number } | null;
    subnetIdsWithGateway: string[];
    expectedRows: unknown[];
  }) => {
    describe('when selecting its dashboard view model', () => {
      let rows: unknown;

      beforeEach(() => {
        rows = selectInstanceDashboard(
          urls,
          'en-GB',
          {
            hasRepricing,
            publicIpPrices,
            gatewayPrice: GATEWAY_PRICE,
            subnetIdsWithGateway,
            catalogDisks: null,
          },
          instanceReachableThrough(addresses),
        )?.pricings;
      });

      it('prices the public IP it holds and the gateway it sits behind', () => {
        expect(rows).toStrictEqual(expectedRows);
      });
    });
  },
);

const specsHolding = (disks: TInstanceDisk[]): TInstanceFlavor['specs'] => ({
  cpu: { value: 8, unit: 'vCore' },
  ram: { value: 32, unit: 'GB' },
  disks,
  bandwidth: {
    public: { value: 1000, unit: 'Mbit/s' },
    private: { value: 2000, unit: 'Mbit/s' },
  },
});

const instanceRunningOn = (specs: TInstanceFlavor['specs']): TInstance => ({
  ...instanceBilledOn([]),
  flavor: { id: 'flavor-id', name: 'b3-8', specs },
});

const nvmeDisk = { capacity: { value: 100, unit: 'GB' }, number: 1 };

const nvmeDiskViewModel = {
  id: '1_100_GB_no-interface_0',
  number: 1,
  capacityValue: 100,
  capacityUnit: 'gb',
  interface: null,
};

const catalogDiskViewModel = {
  id: '2_500_GB_NVMe_0',
  number: 2,
  capacityValue: 500,
  capacityUnit: 'gb',
  interface: 'NVMe',
};

const noDiskViewModel = {
  id: 'no-disk',
  display: '-',
  number: 0,
  capacityValue: 0,
  capacityUnit: 'gb',
  interface: null,
};

describe.each`
  given                                                 | specs                       | catalogDisks              | expectedDisks
  ${'disks in its payload'}                             | ${specsHolding([nvmeDisk])} | ${null}                   | ${[nvmeDiskViewModel]}
  ${'disks in its payload and disks in the catalog'}    | ${specsHolding([nvmeDisk])} | ${[catalogDiskViewModel]} | ${[nvmeDiskViewModel]}
  ${'no disk in its payload, the catalog knowing them'} | ${specsHolding([])}         | ${[catalogDiskViewModel]} | ${[catalogDiskViewModel]}
  ${'no disk in its payload nor in the catalog'}        | ${specsHolding([])}         | ${null}                   | ${[noDiskViewModel]}
  ${'no specs at all, the catalog knowing the disks'}   | ${null}                     | ${[catalogDiskViewModel]} | ${[catalogDiskViewModel]}
`(
  'given an instance with $given',
  ({
    specs,
    catalogDisks,
    expectedDisks,
  }: {
    specs: TInstanceFlavor['specs'];
    catalogDisks: unknown[] | null;
    expectedDisks: unknown[];
  }) => {
    describe('when selecting its dashboard view model', () => {
      let disks: unknown;

      beforeEach(() => {
        disks = selectInstanceDashboard(
          urls,
          'en-GB',
          {
            hasRepricing: true,
            publicIpPrices: null,
            gatewayPrice: null,
            subnetIdsWithGateway: [],
            catalogDisks: catalogDisks as never,
          },
          instanceRunningOn(specs),
        )?.flavor?.disks;
      });

      it('falls back to the catalog disks only when the payload carries none', () => {
        expect(disks).toStrictEqual(expectedDisks);
      });
    });
  },
);
