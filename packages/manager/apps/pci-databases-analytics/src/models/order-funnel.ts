import { order } from './catalog';
import { database } from './database';

export interface Engine {
  name: string;
  description: string;
  category: database.CategoryEnum;
  order: number;
  tags: string[];
  default: boolean;
  defaultVersion: string;
  versions: Version[];
}

export interface Version {
  name: string;
  tags: string[];
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
  tags: string[];
  regions: Region[];
}

export interface Region {
  name: string;
  order: number;
  tags: string[];
  default: boolean;
  flavors: Flavor[];
}

export interface Flavor {
  name: string;
  vcores?: number;
  ram?: { unit: string; value: number };
  storage?: {
    minimum: { unit: string; value: number };
    maximum: { unit: string; value: number };
    step?: { unit: string; value: number };
    pricing?: {
      hourly?: order.publicOrder.Pricing;
      monthly?: order.publicOrder.Pricing;
    };
  };
  order: number;
  default: boolean;
  tags: string[];
  pricing: {
    hourly?: order.publicOrder.Pricing;
    monthly?: order.publicOrder.Pricing;
  };
}
