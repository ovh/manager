import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';

export const hourlyToMonthlyFactor = 730;

export type Pricing = Pick<order.publicOrder.Pricing, 'price' | 'tax'>;

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
    price: offerPricing.price * nbNodes,
    tax: offerPricing.tax * nbNodes,
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
      price: 0,
      tax: 0,
    };
  const storageFactor =
    storageMode ===
    database.capabilities.engine.storage.StrategyEnum.distributed
      ? 1
      : nbNodes;
  return {
    price: additionalStorage * storagePricing.price * storageFactor,
    tax: additionalStorage * storagePricing.tax * storageFactor,
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
    price: flavorPrice.price + storagePrice.price,
    tax: flavorPrice.tax + storagePrice.tax,
  };
  return {
    flavorPrice,
    storagePrice,
    servicePrice,
  };
};
