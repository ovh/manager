import ai from '@/types/AI';

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
