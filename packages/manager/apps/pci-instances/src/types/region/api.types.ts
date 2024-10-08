import { DeepReadonly } from '../utils.type';

type TContinentCode = 'ASIA ' | 'EU' | 'NA' | 'US';

type TIpCountries =
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

type TRegionStatus = 'DOWN' | 'MAINTENANCE' | 'UP';
type TRegionServiceStatus = Omit<TRegionStatus, 'MAINTENANCE'>;

type TRegionType = 'localzone' | 'region' | 'region-3-az';

type TRegionServiceDto = {
  name: string;
  status: TRegionServiceStatus;
  endpoint: string;
};

export type TActivatedRegionDto = DeepReadonly<{
  name: string;
  continentCode: TContinentCode;
  datacenterLocation: string;
  status: TRegionStatus;
  type: TRegionType;
  ipCountries: TIpCountries[];
  services: TRegionServiceDto[];
}>;
