import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';

type Price = Pick<order.publicOrder.Pricing, 'price' | 'tax'>;
export interface Pricing {
  hourly?: Price;
  monthly?: Price;
}

interface ComputeFlavorPriceProps {
  offerPricing: Pricing;
  nbNodes: number;
}
interface ComputeStoragePriceProps {
  nbNodes: number;
  storagePricing?: Pricing;
  storageMode: database.capabilities.engine.storage.StrategyEnum;
  additionalStorage: number;
}
interface ComputeServicePriceProps {
  offerPricing: Pricing;
  nbNodes: number;
  storagePricing?: Pricing;
  storageMode: database.capabilities.engine.storage.StrategyEnum;
  additionalStorage: number;
}

export interface ServicePricing {
  flavorPrice: Pricing;
  storagePrice: Pricing;
  servicePrice: Pricing;
}

export const computeFlavorPrice = ({
  offerPricing,
  nbNodes,
}: ComputeFlavorPriceProps) => {
  return {
    hourly: {
      price: offerPricing.hourly.price * nbNodes,
      tax: offerPricing.hourly.tax * nbNodes,
    },
    monthly: {
      price: offerPricing.monthly.price * nbNodes,
      tax: offerPricing.monthly.tax * nbNodes,
    },
  };
};
export const computeStoragePrice = ({
  nbNodes,
  storagePricing,
  storageMode = database.capabilities.engine.storage.StrategyEnum.distributed,
  additionalStorage = 0,
}: ComputeStoragePriceProps) => {
  if (!storagePricing)
    return {
      hourly: {
        price: 0,
        tax: 0,
      },
      monthly: {
        price: 0,
        tax: 0,
      },
    };
  const storageFactor =
    storageMode ===
    database.capabilities.engine.storage.StrategyEnum.distributed
      ? 1
      : nbNodes;
  return {
    hourly: {
      price: additionalStorage * storagePricing.hourly.price * storageFactor,
      tax: additionalStorage * storagePricing.hourly.tax * storageFactor,
    },
    monthly: {
      price: additionalStorage * storagePricing.monthly.price * storageFactor,
      tax: additionalStorage * storagePricing.monthly.tax * storageFactor,
    },
  };
};

export const computeServicePrice = ({
  offerPricing,
  nbNodes,
  storagePricing,
  storageMode = database.capabilities.engine.storage.StrategyEnum.distributed,
  additionalStorage = 0,
}: ComputeServicePriceProps) => {
  const flavorPrice = computeFlavorPrice({ offerPricing, nbNodes });
  const storagePrice = computeStoragePrice({
    storagePricing,
    storageMode,
    additionalStorage,
    nbNodes,
  });
  const servicePrice = {
    hourly: {
      price: flavorPrice.hourly.price + storagePrice.hourly.price,
      tax: flavorPrice.hourly.tax + storagePrice.hourly.tax,
    },
    monthly: {
      price: flavorPrice.monthly.price + storagePrice.monthly.price,
      tax: flavorPrice.monthly.tax + storagePrice.monthly.tax,
    },
  };
  return {
    flavorPrice,
    storagePrice,
    servicePrice,
  } as ServicePricing;
};
