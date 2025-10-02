import { TDeploymentMode } from '../../types/instance/common.type';

type TRegionName = string;
export type TRegionID = TRegionName;

export type TDeploymentModeID = TDeploymentMode;

type TContinentName = string;
export type TContinentID = TContinentName;

export type TContinent = {
  name: TContinentName;
  datacenterIds: string[];
  tags: string[];
};

export type TRegion = {
  name: TRegionName;
  deploymentMode: TDeploymentModeID;
  continentIds: TContinentID[];
  country: string | null;
  availabilityZones: string[];
  isActivable: boolean;
  isActivated: boolean;
  isInMaintenance: boolean;
  microRegions: string[];
};

export type TDeployment = {
  name: string;
  tags: string[];
};

export type TInstancesCatalog = {
  entities: {
    regions: {
      byId: Map<TRegionID, TRegion>;
      allIds: TRegionID[];
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
