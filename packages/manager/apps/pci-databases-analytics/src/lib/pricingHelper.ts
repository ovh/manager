import { order } from '@/models/catalog';
import { database } from '@/models/database';

export interface ServicePricing {
  hourly?: order.publicOrder.Pricing;
  monthly?: order.publicOrder.Pricing;
}
interface ComputeServicePriceProps {
  offerPricing: ServicePricing;
  nbNodes: number;
  storagePricing?: ServicePricing;
  storageMode: database.capabilities.engine.storage.StrategyEnum;
  additionalStorage: number;
}
export const computeServicePrice = ({
  offerPricing,
  nbNodes,
  storagePricing,
  storageMode = database.capabilities.engine.storage.StrategyEnum.distributed,
  additionalStorage = 0,
}: ComputeServicePriceProps) => {
  const pricing = {
    hourly: {
      price: offerPricing.hourly.price * nbNodes,
      tax: offerPricing.hourly.tax * nbNodes,
    },
    monthly: {
      price: offerPricing.monthly.price * nbNodes,
      tax: offerPricing.monthly.tax * nbNodes,
    },
  };
  if (storagePricing) {
    const storageFactor =
      storageMode ===
      database.capabilities.engine.storage.StrategyEnum.distributed
        ? 1
        : nbNodes;
    pricing.hourly.price +=
      additionalStorage * storagePricing.hourly.price * storageFactor;
    pricing.hourly.tax +=
      additionalStorage * storagePricing.hourly.tax * storageFactor;
    pricing.monthly.price +=
      additionalStorage * storagePricing.monthly.price * storageFactor;
    pricing.monthly.tax +=
      additionalStorage * storagePricing.monthly.tax * storageFactor;
  }
  return pricing;
};
