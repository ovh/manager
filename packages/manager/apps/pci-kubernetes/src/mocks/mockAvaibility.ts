import * as HookModule from '@ovh-ux/manager-pci-common';
import regions from './mockAvaibility.json';

export const mockAvailabilityWith3az = {
  isPending: false,
  data: {
    plans: [],
    products: [
      {
        name: 'kubernetes',
        regions,
      },
    ],
  },
};
// FIXME Temporary fix to avoid breaking tests
export const mockedModule = {
  useProductAvailability: (
    projectId: string,
    filter?: HookModule.ProductAvailabilityFilter,
  ) => {
    if ((projectId && filter) || (projectId && !filter)) {
      return mockAvailabilityWith3az;
    }
    return mockAvailabilityWith3az;
  },
};

export default mockedModule.useProductAvailability;
