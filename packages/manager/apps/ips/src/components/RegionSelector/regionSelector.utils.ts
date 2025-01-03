export const isRegionInEu = (region: string) =>
  region.includes('eu-') || region.includes('labeu-');

export const isRegionInCa = (region: string) => region.includes('ca-');

export const isRegionInUs = (region: string) => region.includes('us-');

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
  eri: 'gb',
  waw: 'pl',
  bru: 'be',
  mad: 'es',
  preprod: 'fr',
  'dev-1': 'fr',
  'dev-2': 'fr',
  vin: 'us',
  hil: 'us',
  dal: 'us',
  lax: 'us',
  chi: 'us',
  nyc: 'us',
  mia: 'us',
  pao: 'us',
  den: 'us',
  atl: 'us',
  bhs: 'ca',
  tor: 'ca',
  sgp: 'sg',
  syd: 'au',
  mum: 'in',
};

export const getCountryCodeByRegion = (region: string) =>
  Object.entries(countryCodeByRegion).find(([regionPart]) =>
    region.includes(regionPart),
  )?.[1];
