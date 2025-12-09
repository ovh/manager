export const isRegionInEu = (region?: string) =>
  region?.includes('eu-') || region?.includes('labeu-');

export const isRegionInCa = (region?: string) => region?.includes('ca-');

export const isRegionInUs = (region?: string) => region?.includes('us-');

export const isRegionInAp = (region?: string) => region?.includes('ap-');

export const hasOnlyOneRegion = (regionList: string[]) =>
  regionList.every(isRegionInCa) ||
  regionList.every(isRegionInEu) ||
  regionList.every(isRegionInAp) ||
  regionList.every(isRegionInUs);

export enum RegionFilter {
  all = 'all',
  eu = 'eu',
  ca = 'ca',
  us = 'us',
  ap = 'ap',
}
