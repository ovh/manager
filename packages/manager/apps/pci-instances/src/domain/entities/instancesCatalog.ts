import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { TDeploymentMode } from '../../types/instance/common.type';

type TMacroRegionName = string;
type TMicroRegionName = string;
export type TMacroRegionID = TMacroRegionName;
export type TMicroRegionID = TMicroRegionName;

export type TDeploymentModeID = TDeploymentMode;

type TContinentName = string;
export type TContinentID = TContinentName;

export type TContinent = {
  name: TContinentName;
  datacenterIds: string[];
  tags: string[];
};

export type TMicroRegion = {
  name: TMicroRegionName;
  availabilityZones: string[];
  isActivable: boolean;
  isInMaintenance: boolean;
};

export type TMacroRegion = {
  name: TMacroRegionName;
  deploymentMode: TDeploymentModeID;
  continentIds: TContinentID[];
  country: TCountryIsoCode | null;
  microRegions: TMicroRegionID[];
};

export type TDeployment = {
  name: string;
  tags: string[];
};

export type TInstancesCatalog = {
  entities: {
    macroRegions: {
      byId: Map<TMacroRegionID, TMacroRegion>;
      allIds: TMacroRegionID[];
    };
    microRegions: {
      byId: Map<TMicroRegionID, TMicroRegion>;
      allIds: TMicroRegionID[];
    };
    deploymentModes: {
      byId: Map<TDeploymentModeID, TDeployment>;
      allIds: TDeploymentModeID[];
    };
    continents: {
      byId: Map<TContinentID, TContinent>;
      allIds: TContinentID[];
    };
  };
  relations: {
    continentIdsByDeploymentModeId: Map<TDeploymentModeID, TContinentID[]>;
  };
};
