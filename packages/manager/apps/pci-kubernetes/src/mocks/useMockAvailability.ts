import { useProductAvailability } from '@ovh-ux/manager-pci-common';
import mockedModule from './mockAvaibility.json';

const useMockProductAvailabilityKube = (projectId: string, { product }) => {
  if (product === 'kubernetes') {
    return {
      data: {
        plans: [],
        products: [
          {
            name: 'kubernetes',
            regions: mockedModule,
          },
        ],
      },
    };
  }

  return useProductAvailability(projectId);
};

export default useMockProductAvailabilityKube;
