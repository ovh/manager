import { TFunction } from 'i18next';

import { Location } from '@/types/Location.type';

/** Décalage entre une lettre ASCII majuscule et son « regional indicator symbol » (drapeaux). */
const REGIONAL_INDICATOR_OFFSET = 0x1f1e6 - 'A'.charCodeAt(0);

/** Emoji drapeau dérivé du code pays ISO-2, chaîne vide si le code est inexploitable. */
export const getFlagEmoji = (countryCode?: string): string => {
  if (!countryCode || countryCode.length !== 2 || !/^[a-zA-Z]{2}$/.test(countryCode)) return '';
  return [...countryCode.toUpperCase()]
    .map((letter) => String.fromCodePoint(letter.charCodeAt(0) + REGIONAL_INDICATOR_OFFSET))
    .join('');
};

/** Libellé d'une localisation : « France – Paris ». */
export const formatLocationTitle = (t: TFunction, location: Location): string =>
  t('region.card_title', { country: location.countryName, city: location.cityName });

export type CountryOption = { countryCode: string; countryName: string };

export const selectCountries = (locations: Location[]): CountryOption[] => {
  const byCode = new Map<string, CountryOption>();
  locations.forEach(({ countryCode, countryName }) => {
    if (!byCode.has(countryCode)) byCode.set(countryCode, { countryCode, countryName });
  });
  return [...byCode.values()].sort((a, b) => a.countryName.localeCompare(b.countryName));
};

export const formatCountryTitle = ({ countryCode, countryName }: CountryOption): string => {
  const flag = getFlagEmoji(countryCode);
  return flag ? `${flag} ${countryName}` : countryName;
};

export const selectLocationsByCountry = (locations: Location[], countryCode: string): Location[] =>
  locations
    .filter((location) => location.countryCode === countryCode)
    .sort((a, b) => a.cityName.localeCompare(b.cityName));

export const formatCityOptionLabel = ({ cityName, name }: Location): string =>
  `${cityName} (${name})`;
