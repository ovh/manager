import { TCountryIsoCode } from '@/components/flag/country-iso-code';

export const DEPLOYMENT_MODES = ['region', 'localzone', 'region-3-az'] as const;
export type TDeploymentMode = typeof DEPLOYMENT_MODES[number];

type TTags = string[] | null;

type TCityName = string;
type TDataCenterName = string;
export type TCityId = TCityName;
export type TDataCenterId = TDataCenterName;
export type TDeploymentModeId = TDeploymentMode;

type TContinentName = string;
export type TContinentId = TContinentName;

export type TContinent = {
  name: TContinentName;
  datacenterIds: string[];
  tags: TTags;
};

export type TDataCenter = {
  name: TDataCenterName;
  availabilityZones: string[];
  isActivable: boolean;
  isInMaintenance: boolean;
  cityId: string;
};

export type TCity = {
  name: TCityName;
  deploymentMode: TDeploymentModeId;
  continentIds: TContinentId[];
  country: TCountryIsoCode | null;
  dataCenters: TDataCenterId[];
};

export type TDeployment = {
  name: string;
  tags: TTags;
};

export type TFileCatalog = {
  entities: {
    continents: {
      byId: Map<TContinentId, TContinent>;
      allIds: TContinentId[];
    };
    cities: {
      byId: Map<TCityId, TCity>;
      allIds: TCityId[];
    };
    dataCenters: {
      byId: Map<TDataCenterId, TDataCenter>;
      allIds: TDataCenterId[];
    };
    deploymentModes: {
      byId: Map<TDeploymentModeId, TDeployment>;
      allIds: TDeploymentModeId[];
    };
  }
};

