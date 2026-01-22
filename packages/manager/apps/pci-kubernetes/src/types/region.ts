import { TContinent } from '@ovh-ux/manager-pci-common';

import { TContinentCode, TCountryCode } from '@/domain/entities/regions';

import { DeploymentMode } from '.';

export type TAvailabilityZone = string;

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

export type TServiceStatus = 'DOWN' | 'UP';
export type TOpenstackRegionStatus = 'DOWN' | 'MAINTENANCE' | 'UP';
export type TRegionType = DeploymentMode;

export type TService = {
  endpoint: string;
  name: string;
  status: TServiceStatus;
};

export type TRegionInformations = {
  availabilityZones: TAvailabilityZone[];
  continentCode: TContinentCode;
  countryCode: TCountryCode;
  datacenterLocation: string;
  ipCountries: IpCountry[];
  name: string;
  services: TService[];
  status: TOpenstackRegionStatus;
  type: TRegionType;
};

export type TRegionBase = {
  name: string;
  type: TRegionType;
  availabilityZones: DeploymentMode[];
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  continentCode: 'ASIA' | 'EU' | 'NA' | 'US' | string;
  datacenter: string;
  enabled: boolean;
  datacenterLocation: string;
};

export type TRegion = TRegionBase & {
  countryCode: TCountryCode;
  services: TService[];
  status: TOpenstackRegionStatus;
  ipCountries: IpCountry[];
  type: TRegionType;
};

export type TProjectLocation = {
  regions: TLocation[];
  continents: TContinent[];
};

export type TRegionCodes = TRegionBase & { codes: string[] };

export type TProductAvailability = {
  plans: {
    code: string;
    regions: TRegionBase[];
  }[];
  products: {
    name: string;
    regions: TRegionBase[];
  }[];
};

export type TLocation = TRegion & {
  isMacro: boolean;
  isLocalZone: boolean;
  macro: string;
  countryCode?: string;
  continentLabel: string;
  macroLabel: string;
  microLabel: string;
  enabled?: boolean;
  codes?: string[] | null;
};
