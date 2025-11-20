import { ProductAvailability } from '@/types/Availability';
import cloud from '@/types/Cloud';

export const mockedAvailability: ProductAvailability = {
  plans: [
    {
      code: 'plan-1',
      regions: [
        {
          availabilityZones: ['GRA1', 'GRA2'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'Gravelines',
          enabled: true,
          name: 'GRA',
          type: cloud.RegionTypeEnum['region-3-az'],
        },
      ],
    },
  ],
  products: [
    {
      name: 'object-storage',
      regions: [
        {
          availabilityZones: ['GRA1', 'GRA2'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'Gravelines',
          enabled: true,
          name: 'GRA',
          type: cloud.RegionTypeEnum['region-3-az'],
        },
      ],
    },
  ],
};
