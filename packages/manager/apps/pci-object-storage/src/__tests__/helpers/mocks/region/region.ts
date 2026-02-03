import { CountryCode2LettersEnum } from '@datatr-ux/ovhcloud-types';
import cloud from '@/types/Cloud';

export const mockedRegion: cloud.Region = {
  availabilityZones: ['AZ1', 'BHS', 'GRA', 'EU-WEST-PAR', 'RBX'],
  continentCode: cloud.RegionContinentEnum.EU,
  countryCode: CountryCode2LettersEnum.fr,
  datacenterLocation: 'BHS',
  ipCountries: [cloud.IpCountryEnum.fr],
  name: 'BHS',
  services: [
    {
      endpoint: 'myEndpoint',
      name: 'storage',
      status: cloud.ServiceStatusEnum.UP,
    },
    {
      endpoint: 'my2ndEndpoint',
      name: 'storage-s3-standard',
      status: cloud.ServiceStatusEnum.UP,
    },
  ],
  status: cloud.RegionStatusEnum.UP,
  type: cloud.RegionTypeEnum.region,
};

export const mocked3AZRegion: cloud.Region = {
  ...mockedRegion,
  name: 'EU-WEST-PAR',
  datacenterLocation: 'EU-WEST-PAR',
  type: cloud.RegionTypeEnum['region-3-az'],
};

export const mockedLZRegion: cloud.Region = {
  ...mockedRegion,
  name: 'RBX',
  datacenterLocation: 'RBX',
  type: cloud.RegionTypeEnum.localzone,
};

export const mockedGRARegion: cloud.Region = {
  ...mockedRegion,
  name: 'GRA',
  datacenterLocation: 'GRA',
  type: cloud.RegionTypeEnum.region,
};
