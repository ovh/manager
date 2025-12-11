import { describe, it } from 'vitest';
import {
  mockedBillingTypesSelectorData,
  mockedInstance,
  mockedInstancesCatalogEntity,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { selectBillingTypes } from '../BillingTypesViewModel';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  configurationPort: {
    selectSshKeys: vi.fn(),
  },
};

describe('selectBillingTypes ViewModel', () => {
  // array hourly, monthly

  it('should return expected types for the billing types options', () => {
    expect(
      selectBillingTypes(fakeDeps)(
        mockedProjectId,
        mockedInstance.flavorId,
        mockedInstance.distributionImageVersion,
      ),
    ).toStrictEqual(mockedBillingTypesSelectorData);
  });
});
