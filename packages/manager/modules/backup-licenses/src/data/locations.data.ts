import { LocationSpecificType, LocationType } from '@/types/Location.type';

/**
 * Catalogue HARDCODÉ des localisations disponibles pour un vault (BKP-1223) : plus de référentiel
 * `/location`, ce sont les seules régions proposées côté commande. `cityName`/`countryName`/
 * `geographyName` sont résolus à l'usage (cf. `useLocations`) depuis les référentiels partagés
 * `region`/`country` de `@ovh-ux/manager-common-translations`.
 */
export interface LocationDefinition {
  name: string;
  code: string;
  cityCode: string;
  countryCode: string;
  geographyCode: string;
  availabilityZones: string[];
  type: LocationType;
  specificType: LocationSpecificType;
}

export const LOCATION_DEFINITIONS: LocationDefinition[] = [
  {
    name: 'eu-west-gra',
    code: 'GRA',
    cityCode: 'GRA',
    countryCode: 'FR',
    geographyCode: 'EU',
    availabilityZones: ['gra-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
  {
    name: 'eu-west-rbx',
    code: 'RBX',
    cityCode: 'RBX',
    countryCode: 'FR',
    geographyCode: 'EU',
    availabilityZones: ['rbx-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
  {
    name: 'eu-west-sbg',
    code: 'SBG',
    cityCode: 'SBG',
    countryCode: 'FR',
    geographyCode: 'EU',
    availabilityZones: ['sbg-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
  {
    name: 'eu-west-lim',
    code: 'DE',
    cityCode: 'DE',
    countryCode: 'DE',
    geographyCode: 'EU',
    availabilityZones: ['de-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
  {
    name: 'eu-west-eri',
    code: 'UK',
    cityCode: 'UK',
    countryCode: 'GB',
    geographyCode: 'EU',
    availabilityZones: ['uk-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
  {
    name: 'eu-central-waw',
    code: 'WAW',
    cityCode: 'WAW',
    countryCode: 'PL',
    geographyCode: 'EU',
    availabilityZones: ['waw-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
  {
    name: 'ca-east-bhs',
    code: 'BHS',
    cityCode: 'BHS',
    countryCode: 'CA',
    geographyCode: 'NA',
    availabilityZones: ['bhs-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
  {
    name: 'ca-east-tor',
    code: 'TOR',
    cityCode: 'TOR',
    countryCode: 'CA',
    geographyCode: 'NA',
    availabilityZones: ['ca-east-tor-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
  {
    name: 'ap-southeast-sgp',
    code: 'SGP',
    cityCode: 'SGP',
    countryCode: 'SG',
    geographyCode: 'AP',
    availabilityZones: ['sgp-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
  {
    name: 'ap-southeast-syd',
    code: 'SYD',
    cityCode: 'SYD',
    countryCode: 'AU',
    geographyCode: 'OC',
    availabilityZones: ['ap-southeast-syd-a'],
    type: LocationType.REGION_1_AZ,
    specificType: LocationSpecificType.STANDARD,
  },
];
