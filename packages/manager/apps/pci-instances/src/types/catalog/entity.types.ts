import { DeepReadonly } from '../utils.type';

/**
 * Model types
 */
export type TModelCategory = {
  name: string;
  isNew: boolean;
  isDefault: boolean;
};

export type TPriceInterval = 'hour' | 'month';

export type TModelPricing = {
  price: number;
  interval: TPriceInterval;
};

export type TCpu = {
  cores: number;
  frequency: number;
  model: string;
};

export type TGpu = {
  number: number;
  model: string;
};

export type TMemory = {
  size: number;
  unit: string;
};

export type TStorage = {
  capacity: number;
  number: number;
  technology: string;
  sizeUnit: string;
};

export type TModelSpecification = {
  memory: TMemory;
  cpu: TCpu;
  storage: TStorage[];
  bandwidth: number;
  gpu: TGpu;
};

export type TModel = {
  category: string;
  name: string;
  isNew: boolean;
  compatibleLocalzone: boolean;
  compatibleRegion: boolean;
  pricings: TModelPricing[];
  specifications: TModelSpecification;
  banners: string[];
};

export type TModelEntity = DeepReadonly<{
  models: {
    data: TModel[];
    categories: TModelCategory[];
  };
}>;

/**
 * Region types
 */

export type TRegionAvailability = 'available' | 'unavailable';

export type TRegionCategory = {
  name: string;
  isNew: boolean;
};

export type TRegion = {
  name: string;
  category: string;
  datacenter: string;
  isLocalzone: boolean;
  isInMaintenance: boolean;
  isActivated: boolean;
  country: string | null;
};

export type TRegionsData = {
  allAvailableRegions: TRegion[];
  availableMacroRegions: TRegion[];
  availableMicroRegions: TRegion[];
  unavailableRegions: TRegion[];
};
export type TRegionEntity = DeepReadonly<{
  regions: {
    data: TRegionsData;
    categories: TRegionCategory[];
  };
}>;
