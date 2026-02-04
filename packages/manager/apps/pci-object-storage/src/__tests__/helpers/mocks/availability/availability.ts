import { ProductAvailability } from '@/types/Availability';
import cloud from '@/types/Cloud';
import { CountryCode2LettersEnum } from '@datatr-ux/ovhcloud-types';

export const mockedAvailability: ProductAvailability = {
  plans: [
    {
      code: 'storage',
      regions: [
        {
          countryCode: CountryCode2LettersEnum.fr,
          availabilityZones: ['BHS1', 'BHS2', 'BHS3'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'BHS',
          enabled: true,
          name: 'BHS',
          type: cloud.RegionTypeEnum.region,
        },
        {
          countryCode: CountryCode2LettersEnum.fr,
          availabilityZones: ['EU-WEST-PAR'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'EU-WEST-PAR',
          enabled: true,
          name: 'EU-WEST-PAR',
          type: cloud.RegionTypeEnum['region-3-az'],
        },
        {
          countryCode: CountryCode2LettersEnum.fr,
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
          countryCode: CountryCode2LettersEnum.fr,
          availabilityZones: ['BHS1', 'BHS2', 'BHS3'],
          continentCode: cloud.RegionContinentEnum.EU,
          datacenter: 'BHS',
          enabled: true,
          name: 'BHS',
          type: cloud.RegionTypeEnum.region,
        },
        {
          countryCode: CountryCode2LettersEnum.fr,
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
