import { beforeEach, describe, expect, it } from 'vitest';
import { selectInstanceDashboard } from '../selectInstanceDashboard';
import { TInstance, TInstancePrice } from '@/types/instance/entity.type';
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
          isStoragePriceDisplayed,
          instanceBilledOn(pricings),
        )?.pricings;
      });

      it('lists one labelled row per price it is billed on', () => {
        expect(rows).toStrictEqual(expectedRows);
      });
    });
  },
);
