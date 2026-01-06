import { ProductAvailability } from '@/types/Availability';
import cloud from '@/types/Cloud';

export const mockedAvailability: ProductAvailability = {
  plans: [
    {
      code: 'storage',
      regions: [
        {
          availabilityZones: ['BHS1', 'BHS2', 'BHS3'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'BHS',
          enabled: true,
          name: 'BHS',
          type: cloud.RegionTypeEnum.region,
        },
        {
          availabilityZones: ['EU-WEST-PAR'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'EU-WEST-PAR',
          enabled: true,
          name: 'EU-WEST-PAR',
          type: cloud.RegionTypeEnum['region-3-az'],
        },
        {
          availabilityZones: ['RBX'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'RBX',
          enabled: true,
          name: 'RBX',
          type: cloud.RegionTypeEnum.localzone,
        },
      ],
    },
  ],
  products: [
    {
      name: 'object-storage',
      regions: [
        {
          availabilityZones: ['BHS1', 'BHS2', 'BHS3'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'BHS',
          enabled: true,
          name: 'BHS',
          type: cloud.RegionTypeEnum.region,
        },
        {
          availabilityZones: ['EU-WEST-PAR'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'EU-WEST-PAR',
          enabled: true,
          name: 'EU-WEST-PAR',
          type: cloud.RegionTypeEnum['region-3-az'],
        },
      ],
    },
  ],
};
