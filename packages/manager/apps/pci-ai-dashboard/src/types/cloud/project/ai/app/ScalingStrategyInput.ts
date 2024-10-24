import { ScalingAutomaticStrategyInput } from '@/types/cloud/project/ai/app/ScalingAutomaticStrategyInput';
import { ScalingFixedStrategyInput } from '@/types/cloud/project/ai/app/ScalingFixedStrategyInput';

/** AI Solutions App Status Object */
export interface ScalingStrategyInput {
  /** Strategy setting a variable number of replicas, based on an average resource usage threshold (conflicts with 'fixed' property when both are not null) */
  automatic: ScalingAutomaticStrategyInput;
  /** Strategy setting a fix number of replicas (conflicts with 'automatic' property when both are not null) */
  fixed: ScalingFixedStrategyInput;
}
