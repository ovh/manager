import { getCountryCode } from '@/utils';

export const shadowColor = '#000E9C33';

export const getCountryKey = (region: string) =>
  `region-selector-country-name_${getCountryCode(region)?.toUpperCase()}`;

export const getCityNameKey = (region: string) =>
  `region-selector-city-name_${region}`;
