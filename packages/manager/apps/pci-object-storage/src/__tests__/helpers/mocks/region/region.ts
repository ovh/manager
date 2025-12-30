import { CountryCode2LettersEnum } from '@datatr-ux/ovhcloud-types';
import cloud from '@/types/Cloud';

export const mockedRegion: cloud.Region = {
  availabilityZones: ['AZ1', 'BHS', 'GRA'],
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
  ],
  status: cloud.RegionStatusEnum.UP,
  type: cloud.RegionTypeEnum['region-3-az'],
};
