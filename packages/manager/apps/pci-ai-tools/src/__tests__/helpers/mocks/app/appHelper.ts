import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';

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
