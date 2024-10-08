import { DeepReadonly } from '../utils.type';

export type TCategoryDto = {
  name: string;
  isNew: boolean;
  isDefault: boolean;
};

export type TRegionDto = {
  name: string;
  country: string | null;
  datacenter: string;
  isLocalzone: boolean;
  isInMaintenance: boolean;
  isActivated: boolean;
  category: string;
};

export type TRegionCategoryDto = {
  name: string;
  isNew: boolean;
};

export type TPriceIntervalDto = 'hour' | 'month';
export type TOsTypeDto = 'linux' | 'windows';

export type TPricingDto = {
  price: number;
  regions: string[];
  interval: TPriceIntervalDto;
  osType: TOsTypeDto;
};

export type TBandWidthDto = {
  guaranteed: boolean;
  level: number;
  unlimited: boolean;
};

export type TCpuDto = {
  cores: number;
  frequency: number;
  model: string;
  type: string;
};

export type TGpuDto = {
  memory: TGpuMemoryDto;
  model: string;
  number: number;
};

export type TGpuMemoryDto = TMemoryDto & {
  interface: string;
};

export type TMemoryDto = {
  size: number;
};

export type TDiskDto = {
  capacity: number;
  number: number;
  technology: string;
};

export type TStorageDto = {
  disks: TDiskDto[];
  raid: string;
};

export type TVrackDto = {
  guaranteed: boolean;
  level: number;
  unlimited: boolean;
};

export type TSpecificationsDto = {
  bandwidth: TBandWidthDto;
  cpu: TCpuDto;
  gpu: TGpuDto;
  memory: TMemoryDto;
  storage: TStorageDto;
  vrack: TVrackDto;
};

export type TModelDto = {
  category: string;
  name: string;
  isNew: boolean;
  compatibleLocalzone: boolean;
  compatibleRegion: boolean;
  pricings: TPricingDto[];
  specifications: TSpecificationsDto;
  banners: string[];
};

export type TCatalogDto = DeepReadonly<{
  projectId: string;
  models: TModelDto[];
  categories: TCategoryDto[];
  regions: TRegionDto[];
  regionCategories: TRegionCategoryDto[];
}>;
