import { describe, it } from 'vitest';
import {
  mockedInstancesCatalogDTO,
  mockedInstancesCatalogEntity,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { selectBillingTypes } from '../BillingTypesViewModel';
import { BILLING_TYPE } from '@/types/instance/common.type';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  instancePort: {
    createInstance: vi.fn(),
  },
};

describe('selectBillingTypes ViewModel', () => {
  const image = mockedInstancesCatalogDTO.images[0]?.osType;
  const mockedResult = [BILLING_TYPE.Hourly];

  it('should return expected types for the billing types options', () => {
    expect(
      selectBillingTypes(fakeDeps)(
        'AlmaLinux 8',
        'd2-2_GRA-STAGING-A',
        image ?? null,
      ),
    ).toStrictEqual(mockedResult);
  });

  it('should return empty array if missing data', () => {
    expect(
      selectBillingTypes(fakeDeps)('AlmaLinux 8', '', image ?? null),
    ).toStrictEqual([]);
  });

  describe('non-period prices', () => {
    const selectWithPrices = (prices: { type: string }[]) =>
      selectBillingTypes({
        ...fakeDeps,
        instancesCatalogPort: {
          selectInstancesCatalog: vi.fn().mockReturnValue({
            entities: {
              flavorPrices: {
                byId: new Map([['flavor_linux_price', { prices }]]),
              },
            },
          }),
        },
      } as Deps)('project', 'flavor', 'linux');

    it('offers both periods when the catalog prices both', () => {
      expect(
        selectWithPrices([{ type: 'hour' }, { type: 'month' }]),
      ).toStrictEqual([BILLING_TYPE.Hourly, BILLING_TYPE.Monthly]);
    });

    it('never turns a localDisk price into a billing option', () => {
      expect(
        selectWithPrices([
          { type: 'hour' },
          { type: 'month' },
          { type: 'localDisk' },
        ]),
      ).toStrictEqual([BILLING_TYPE.Hourly, BILLING_TYPE.Monthly]);
    });

    it('keeps an hourly-only flavor hourly-only despite a localDisk price', () => {
      expect(
        selectWithPrices([{ type: 'hour' }, { type: 'localDisk' }]),
      ).toStrictEqual([BILLING_TYPE.Hourly]);
    });

    it('ignores licence prices', () => {
      expect(
        selectWithPrices([
          { type: 'hour' },
          { type: 'licence' },
          { type: 'licenceMonth' },
        ]),
      ).toStrictEqual([BILLING_TYPE.Hourly]);
    });
  });
});
