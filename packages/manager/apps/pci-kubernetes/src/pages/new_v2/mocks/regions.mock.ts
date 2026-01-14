import { TContinentCode } from '@/domain/entities/regions';

// TODO (TAPC-5549): Ces données mock seront remplacées par de vraies données API
export type TMockRegion = {
  id: string;
  title: string;
  datacenter: string;
  country: string;
  continent: TContinentCode;
  microRegions: string[];
  plans: string[];
  disabled: boolean;
};

export const MOCK_REGIONS: Array<TMockRegion> = [
  {
    id: 'GRA',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    continent: 'EU',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: true,
  },
  {
    id: 'SBG',
    title: 'Strasbourg',
    datacenter: 'SBG',
    country: 'fr',
    continent: 'EU',
    microRegions: ['SBG5', 'SBG7'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'BHS',
    title: 'Beauharnois',
    datacenter: 'BHS',
    country: 'ca',
    continent: 'NA',
    microRegions: ['BHS3', 'BHS5'],
    plans: [],
    disabled: true,
  },
  {
    id: 'WAW',
    title: 'Varsovie',
    datacenter: 'WAW',
    country: 'pl',
    continent: 'EU',
    microRegions: ['WAW1'],
    plans: ['standard'],
    disabled: false,
  },
  {
    id: 'DE',
    title: 'Francfort',
    datacenter: 'DE',
    country: 'de',
    continent: 'EU',
    microRegions: ['DE1', 'DE2'],
    plans: ['free'],
    disabled: false,
  },
  {
    id: 'UK',
    title: 'Londres',
    datacenter: 'UK',
    country: 'uk',
    continent: 'EU',
    microRegions: ['UK1', 'UK3'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'SGP',
    title: 'Singapour',
    datacenter: 'SGP',
    country: 'sg',
    continent: 'ASIA',
    microRegions: ['SGP1'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'SYD',
    title: 'Sydney',
    datacenter: 'SYD',
    country: 'au',
    continent: 'ASIA',
    microRegions: ['SYD1', 'SYD2'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'HIL',
    title: 'Hillsboro',
    datacenter: 'HIL',
    country: 'us',
    continent: 'US',
    microRegions: ['HIL1'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'ES',
    title: 'Madrid',
    datacenter: 'ES',
    country: 'es',
    continent: 'EU',
    microRegions: ['ES1', 'ES2'],
    plans: ['free', 'standard'],
    disabled: false,
  },
] as Array<TMockRegion>;
