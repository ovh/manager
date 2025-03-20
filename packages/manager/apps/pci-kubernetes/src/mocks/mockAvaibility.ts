import * as HookModule from '@ovh-ux/manager-pci-common';
import regions from './mockAvaibility.json';

export const mockAvailabilityWith3az = {
  isPending: false,
  data: {
    plans: [],
    products: {
      name: 'kubernetes',
      regions,
    },
  },
};

export const mockedModule = {
  useProductAvailability: (
    projectId: string,
    filter?: HookModule.ProductAvailabilityFilter,
  ) => mockAvailabilityWith3az,
};

export default mockedModule.useProductAvailability;
