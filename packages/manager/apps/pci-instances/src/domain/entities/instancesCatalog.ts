import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { TDeploymentMode } from '../../types/instance/common.type';

type TTags = string[] | null;

type TMacroRegionName = string;
type TMicroRegionName = string;
export type TMacroRegionID = TMacroRegionName;
export type TMicroRegionID = TMicroRegionName;
export type TDeploymentModeID = TDeploymentMode;

type TContinentName = string;
export type TContinentID = TContinentName;

type TFlavorCategoryName = string;
export type TFlavorCategoryID = TFlavorCategoryName;

type TFlavorTypeName = string;
export type TFlavorTypeID = TFlavorTypeName;

type TFlavorName = string;
export type TFlavorID = TFlavorName;

export type TFlavorType = {
  name: TFlavorTypeName;
  flavors: TFlavorID[];
  tags: TTags;
};

export type TFlavorCategory = {
  name: TFlavorCategoryName;
  types: TFlavorTypeID[];
  tags: TTags;
};

export type TContinent = {
  name: TContinentName;
  datacenterIds: string[];
  tags: TTags;
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
  tags: TTags;
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
    flavorCategories: {
      byId: Map<TFlavorCategoryID, TFlavorCategory>;
      allIds: TFlavorCategoryID[];
    };
    flavorTypes: {
      byId: Map<TFlavorTypeID, TFlavorType>;
      allIds: TFlavorTypeID[];
    };
  };
  relations: {
    continentIdsByDeploymentModeId: Map<TDeploymentModeID, TContinentID[]>;
  };
};
