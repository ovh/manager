import {
  ContinentCountryLocation,
  ContinentEnum,
  CountryEnum,
} from '@datatr-ux/ovhcloud-types/me/geolocation';

export const mockedGeolocation: ContinentCountryLocation = {
  continent: ContinentEnum.europe,
  countryCode: CountryEnum.fr,
  ip: '0.0.0.0',
};
