import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';
import { Engine, Flavor, Plan, Region, Version } from '@/types/orderFunnel';

export const mockedBasicOrderFunnelFlavor: Flavor = {
  name: 'flavorName',
  order: 1,
  default: true,
  vcores: 2,
  ram: { unit: 'GB', value: 40 },
  tags: [database.capabilities.TagEnum.current],
  pricing: {
    hourly: {
      capacities: [order.cart.GenericProductPricingCapacitiesEnum.consumption],
      commitment: 1,
      description: 'description',
      interval: 2,
      intervalUnit: order.cart.DurationUnitEnum.day,
      mode: 'mode',
      mustBeCompleted: true,
      phase: 14,
      price: 1,
      quantity: {
        min: 1,
      },
      repeat: {
        min: 1,
      },
      strategy: order.cart.GenericProductPricingStrategyEnum.stairstep,
      tax: 1,
      type: order.cart.GenericProductPricingTypeEnum.consumption,
    },
    monthly: {
      capacities: [order.cart.GenericProductPricingCapacitiesEnum.consumption],
      commitment: 1,
      description: 'description',
      interval: 2,
      intervalUnit: order.cart.DurationUnitEnum.day,
      mode: 'mode',
      mustBeCompleted: true,
      phase: 14,
      price: 30,
      quantity: {
        min: 3,
      },
      repeat: {
        min: 10,
      },
      strategy: order.cart.GenericProductPricingStrategyEnum.stairstep,
      tax: 1,
      type: order.cart.GenericProductPricingTypeEnum.consumption,
    },
  },
};

export const mockedOrderFunnelRegion: Region = {
  name: 'regionName',
  order: 1,
  tags: [database.capabilities.TagEnum.current],
  default: true,
  flavors: [mockedBasicOrderFunnelFlavor],
};

export const mockedOrderFunnelRegionBis: Region = {
  name: 'region2Name',
  order: 2,
  tags: [database.capabilities.TagEnum.current],
  default: false,
  flavors: [mockedBasicOrderFunnelFlavor],
};

export const mockedPricing = {
  hourly: {
    capacities: [order.cart.GenericProductPricingCapacitiesEnum.consumption],
    commitment: 1,
    description: 'description',
    interval: 2,
    intervalUnit: order.cart.DurationUnitEnum.day,
    mode: 'mode',
    mustBeCompleted: true,
    phase: 14,
    price: 1,
    quantity: {
      min: 1,
    },
    repeat: {
      min: 1,
    },
    strategy: order.cart.GenericProductPricingStrategyEnum.stairstep,
    tax: 1,
    type: order.cart.GenericProductPricingTypeEnum.consumption,
  },
  monthly: {
    capacities: [order.cart.GenericProductPricingCapacitiesEnum.consumption],
    commitment: 1,
    description: 'description',
    interval: 2,
    intervalUnit: order.cart.DurationUnitEnum.day,
    mode: 'mode',
    mustBeCompleted: true,
    phase: 14,
    price: 30,
    quantity: {
      min: 3,
    },
    repeat: {
      min: 10,
    },
    strategy: order.cart.GenericProductPricingStrategyEnum.stairstep,
    tax: 1,
    type: order.cart.GenericProductPricingTypeEnum.consumption,
  },
};

export const mockedBasicOrderFunnelPlan: Plan = {
  name: 'planName',
  nodes: {
    minimum: 1,
    maximum: 3,
  },
  minPricing: mockedPricing,
  order: 1,
  default: false,
  networks: [database.NetworkTypeEnum.private],
  backups: true,
  tags: [database.capabilities.TagEnum.current],
  regions: [mockedOrderFunnelRegion],
};

export const mockedEngineVersion: Version = {
  name: 'versionName',
  tags: [database.capabilities.TagEnum.current],
  default: true,
  order: 1,
  plans: [mockedBasicOrderFunnelPlan],
};

export const mockedOrderFunnelEngine: Engine = {
  name: 'engineName',
  description: 'engineDescription',
  category: database.engine.CategoryEnum.operational,
  order: 1,
  tags: [database.capabilities.TagEnum.current],
  default: true,
  defaultVersion: 'versionName',
  storageMode: database.capabilities.engine.storage.StrategyEnum.distributed,
  versions: [mockedEngineVersion],
};

export const mockedOrderFunnelIps: database.IpRestrictionCreation[] = [
  {
    description: 'Ip1',
    ip: '0.0.0.0/32',
  },
  {
    description: 'Ip2',
    ip: '104.140.104.0/32',
  },
];
