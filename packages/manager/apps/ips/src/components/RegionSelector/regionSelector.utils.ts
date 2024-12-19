export const isEu = (region: string) =>
  region.includes('eu-') || region.includes('labeu-');

export const isCa = (region: string) => region.includes('ca-');

export const isUs = (region: string) => region.includes('us-');

export enum RegionFilter {
  all = 'all',
  eu = 'eu',
  ca = 'ca',
  us = 'us',
}

export const selectedBorderColor = '#0050D7';
export const shadowColor = '#000E9C33';
