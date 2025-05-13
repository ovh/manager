import { order } from '../catalog';
import * as database from '@/types/cloud/project/database';

export interface EngineWithVersion {
  engine: string;
  version: string;
}

export interface NetworkOptionValue {
  type: database.NetworkTypeEnum;
  networkId?: string;
  subnetId?: string;
}

export interface Engine {
  name: string;
  description: string;
  category: database.engine.CategoryEnum;
  order: number;
  tags: database.capabilities.TagEnum[];
  default: boolean;
  defaultVersion: string;
  storageMode: database.capabilities.engine.storage.StrategyEnum;
  versions: Version[];
}

export interface Version {
  name: string;
  tags: database.capabilities.TagEnum[];
  default: boolean;
  order: number;
  plans: Plan[];
}

export interface Plan {
  name: string;
  ram?: {
    minimum: { unit: string; value: number };
    maximum: { unit: string; value: number };
  };
  cpu?: {
    minimum: number;
    maximum: number;
  };
  storage?: {
    minimum: { unit: string; value: number };
    maximum: { unit: string; value: number };
  };
  nodes: {
    minimum: number;
    maximum: number;
  };
  minPricing?: {
    hourly?: order.publicOrder.Pricing;
    monthly?: order.publicOrder.Pricing;
  };
  order: number;
  default: boolean;
  networks: database.NetworkTypeEnum[];
  backups: boolean;
  tags: database.capabilities.TagEnum[];
  regions: Region[];
}

export interface Region {
  name: string;
  order: number;
  tags: database.capabilities.TagEnum[];
  default: boolean;
  flavors: Flavor[];
}

export interface Flavor {
  name: string;
  vcores?: number;
  ram?: { unit: string; value: number };
  storage?: {
    minimum?: { unit: string; value: number };
    maximum?: { unit: string; value: number };
    step?: { unit: string; value: number };
    pricing?: {
      hourly?: order.publicOrder.Pricing;
      monthly?: order.publicOrder.Pricing;
    };
  };
  order: number;
  default: boolean;
  tags: database.capabilities.TagEnum[];
  pricing: {
    hourly?: order.publicOrder.Pricing;
    monthly?: order.publicOrder.Pricing;
  };
}

export enum ForkSourceType {
  'now' = 'now',
  'pit' = 'pit',
  'backup' = 'backup',
}
export interface ForkSource {
  type: ForkSourceType;
  backupId?: string;
  pointInTime?: Date;
  serviceId: string;
}
