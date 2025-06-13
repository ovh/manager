import ai from '@/types/AI';
import { AppPricing, Scaling } from '@/types/orderFunnel';

export const mockedAppPricing1: AppPricing = {
  price: 1,
  tax: 1,
};

export const mockedOrderScaling: Scaling = {
  autoScaling: true,
  averageUsageTarget: 75,
  resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
  replicasMin: 2,
  replicasMax: 100,
  replicas: 2,
};

export const mockedFixedScaling: ai.app.ScalingStrategy = {
  fixed: {
    replicas: 2,
  },
};

export const mockedAutoScaling: ai.app.ScalingStrategy = {
  automatic: {
    replicasMin: 2,
    replicasMax: 100,
    averageUsageTarget: 75,
    resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
  },
};
