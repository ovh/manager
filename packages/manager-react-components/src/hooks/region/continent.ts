import { TLocalisation } from '@ovh-ux/manager-pci-common/src/components/region-selector/useRegions';

export enum Continent {
  NORTH_AMERICA = 'NORTH_AMERICA',
  CENTRAL_EUROPE = 'CENTRALE_EUROPE',
  OUEST_EUROPE = 'OUEST_EUROPE',
  SOUTH_EUROPE = 'SOUTH_EUROPE',
  NORTH_AFRICA = 'NORTH_AFRICA',
  ASIA_PACIFIC = 'ASIA_PACIFIC',
  MIDDLE_EAST = 'MIDDLE_EAST',
  CENTRAL_AMERICA = 'CENTRAL_AMERICA',
  SOUTH_AMERICA = 'SOUTH_AMERICA',
  NORTH_EUROPE = 'NORTH_EUROPE',
  AFRICA = 'AFRICA',
  ASIA_SE = 'ASIA_SE',
  OCEANIA = 'OCEANIA',
  UNKNOWN = 'UNKNOWN',
}

export function getZoneFromMacro(macro: string): Continent {
  switch (macro) {
    case 'VIN':
    case 'HIL':
    case 'OR':
    case 'VA':
    case 'TOR':
    case 'DAL':
    case 'LAX':
    case 'CHI':
    case 'NYC':
    case 'MIA':
    case 'PAO':
    case 'DEN':
    case 'ATL':
    case 'AUS':
    case 'BOS':
    case 'SEA':
    case 'PHD':
    case 'HOU':
    case 'VAN':
    case 'CLT':
    case 'BNA':
    case 'SLC':
    case 'SLT':
    case 'IND':
    case 'BHS':
    case 'CA':
      return Continent.NORTH_AMERICA;
    case 'PRG':
    case 'BUH':
    case 'SOF':
    case 'SBG':
    case 'WAW':
    case 'DE':
      return Continent.CENTRAL_EUROPE;
    case 'AMS':
    case 'ZRH':
    case 'LUX':
    case 'LAU':
    case 'VIE':
    case 'DLN':
    case 'MNC':
    case 'GRA':
    case 'RBX':
    case 'GS':
    case 'MAD':
    case 'BRU':
    case 'UK':
    case 'SHA':
    case 'MRS':
      return Continent.OUEST_EUROPE;
    case 'MIL':
    case 'LIS':
      return Continent.SOUTH_EUROPE;
    case 'RBA':
    case 'TUN':
      return Continent.NORTH_AFRICA;
    case 'TYO':
    case 'BLR':
    case 'JKT':
    case 'BKK':
    case 'AKL':
    case 'TPE':
    case 'SEL':
    case 'MEL':
    case 'ICD':
    case 'OSA':
    case 'KUL':
    case 'MNL':
    case 'SGN':
    case 'MUM':
      return Continent.ASIA_PACIFIC;
    case 'DXB':
    case 'DOH':
    case 'TLV':
    case 'IST':
      return Continent.MIDDLE_EAST;
    case 'MEX':
      return Continent.CENTRAL_AMERICA;
    case 'SAO':
    case 'BUE':
    case 'SCL':
    case 'BOG':
      return Continent.SOUTH_AMERICA;
    case 'HEL':
    case 'OSL':
    case 'SMP':
    case 'KOG':
      return Continent.NORTH_EUROPE;
    case 'LAG':
    case 'CPT':
    case 'NBO':
    case 'ABJ':
    case 'CAI':
      return Continent.AFRICA;
    case 'SGP':
      return Continent.ASIA_SE;
    case 'SYD':
      return Continent.OCEANIA;
    default:
      return Continent.UNKNOWN;
  }
}
