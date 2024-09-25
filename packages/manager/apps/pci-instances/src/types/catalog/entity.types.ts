import { DeepReadonly } from '../utils.type';

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

export type TMemory = {
  size: number;
  unit: string;
};

export type TStorage = {
  capacity: number;
  number: number;
  technology: string;
  unit: string;
};

export type TModelSpecification = {
  memory: TMemory;
  cpu: TCpu;
  storage: TStorage[];
  bandwidth: number;
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
