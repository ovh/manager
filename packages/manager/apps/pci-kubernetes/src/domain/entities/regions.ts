import { TNormalizedEntity } from '@/types';

export const DEPLOYMENT_MODES = ['region', 'localzone', 'region-3-az'] as const;
export type TDeploymentMode = (typeof DEPLOYMENT_MODES)[number];

export const CONTINENT_CODES = ['AF', 'ASIA', 'EU', 'NA', 'US'] as const;
export type TContinentCode = (typeof CONTINENT_CODES)[number];

export const COUNTRY_CODES = [
  /* eslint-disable prettier/prettier */
  'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb',
  'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bl', 'bm', 'bn', 'bo', 'bq', 'br', 'bs', 'bt', 'bv', 'bw', 'by',
  'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cw', 'cx',
  'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'fi', 'fj', 'fk',
  'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs',
  'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir',
  'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 
  'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mf', 'mg', 'mh', 'mk',
  'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne',
  'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm',
  'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg',
  'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf',
  'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'uk', 'um', 'us',
  'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm', 'zw', 
  /* eslint-enable prettier/prettier */
] as const;
export type TCountryCode = (typeof COUNTRY_CODES)[number];

export type TMacroRegionName = string;
export type TMacroRegionID = TMacroRegionName;
export type TMicroRegionName = string;
export type TMicroRegionID = TMicroRegionName;

export type TOpenstackRegionStatus = 'DOWN' | 'MAINTENANCE' | 'UP';

export type TServiceStatus = 'DOWN' | 'UP';
export type TService = {
  endpoint: string;
  name: string;
  status: TServiceStatus;
};

export const PLAN_CODES = [
  'mks.free.hour.consumption',
  'mks.free.hour.consumption.3az',
  'mks.standard.hour.consumption',
  'mks.standard.hour.consumption.3az',
] as const;
export type TPlanCode = (typeof PLAN_CODES)[number];

export type TMacroRegion = {
  name: string;
  countryCode: TCountryCode | null;
  continentCode: TContinentCode;
  microRegionIds: Array<TMicroRegionID>;
  plans: Array<TPlanCode>;
  enabled: boolean;
};

export type TMicroRegion = {
  name: string;
  macroRegionId: TMacroRegionID;
  availabilityZones: string[];
  deploymentMode: TDeploymentMode;
  enabled: boolean;
};

export type TRegions = {
  entities: {
    macroRegions: TNormalizedEntity<TMacroRegionID, TMacroRegion>;
    microRegions: TNormalizedEntity<TMicroRegionID, TMicroRegion>;
  };
  relations: {
    planRegions: Partial<Record<TPlanCode, TMacroRegionID[]>>;
  };
};

export type IpCountry =
  | 'au'
  | 'be'
  | 'ca'
  | 'cz'
  | 'de'
  | 'es'
  | 'fi'
  | 'fr'
  | 'ie'
  | 'in'
  | 'it'
  | 'lt'
  | 'nl'
  | 'pl'
  | 'pt'
  | 'sg'
  | 'uk'
  | 'us';
