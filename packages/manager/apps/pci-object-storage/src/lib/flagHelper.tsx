import { Region3AZ } from '@/configuration/region.const';

export const getRegionFlag = (region: string): string | undefined => {
  switch (region) {
    case 'BHS':
    case 'TOR':
      return 'ca';
    case Region3AZ.PARIS:
    case 'GRA':
    case 'SBG':
    case 'PAR':
    case 'RBX':
      return 'fr';
    case 'WAW':
      return 'pl';
    case 'DE':
      return 'de';
    case 'SGP':
      return 'sg';
    case 'UK':
      return 'gb';
    case 'US-EAST-VA':
    case 'US-WEST-OR':
      return 'us';
    default:
      return undefined;
  }
};
