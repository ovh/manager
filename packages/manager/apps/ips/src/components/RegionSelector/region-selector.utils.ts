export const isRegionInEu = (region?: string) =>
  region?.includes('eu-') || region?.includes('labeu-');

export const isRegionInCa = (region?: string) => region?.includes('ca-');

export const isRegionInUs = (region?: string) => region?.includes('us-');

export const hasOnlyOneRegion = (regionList: string[]) =>
  regionList.every(isRegionInCa) ||
  regionList.every(isRegionInEu) ||
  regionList.every(isRegionInUs);

export enum RegionFilter {
  all = 'all',
  eu = 'eu',
  ca = 'ca',
  us = 'us',
}

export const shadowColor = '#000E9C33';

export const countryCodeByRegion = {
  par: 'fr',
  gra: 'fr',
  rbx: 'fr',
  sbg: 'fr',
  mrs: 'fr',
  lim: 'de',
  dln: 'de',
  eri: 'gb',
  mnc: 'gb',
  waw: 'pl',
  vie: 'at',
  bru: 'be',
  mad: 'es',
  pra: 'cz',
  ams: 'nl',
  mil: 'it',
  zrh: 'ch',
  buh: 'ro',
  preprod: 'fr',
  'dev-1': 'fr',
  'dev-2': 'fr',
  sha: 'fr',
  vin: 'us',
  hil: 'us',
  dal: 'us',
  lax: 'us',
  chi: 'us',
  nyc: 'us',
  mia: 'us',
  pao: 'us',
  den: 'us',
  ind: 'us',
  stl: 'us',
  atl: 'us',
  slc: 'us',
  bna: 'us',
  clt: 'us',
  bos: 'us',
  sea: 'us',
  phd: 'us',
  hou: 'us',
  van: 'ca',
  bhs: 'ca',
  tor: 'ca',
  sgp: 'sg',
  syd: 'au',
  mum: 'in',
  blr: 'in',
  rba: 'ma',
  jkt: 'id',
  tyo: 'jp',
  dxb: 'ae',
  lux: 'lu',
  lau: 'ch',
  hel: 'fi',
};

export const getCountryCode = (region?: string) =>
  Object.entries(countryCodeByRegion).find(([regionPart]) =>
    region?.includes(regionPart),
  )?.[1];

export const getCountryKey = (region: string) =>
  `region-selector-country-name_${getCountryCode(region)}`;

export const getCityNameKey = (region: string) =>
  `region-selector-city-name_${region}`;
