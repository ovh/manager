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
});
