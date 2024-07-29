import { ScalingAutomaticStrategy } from '@/types/cloud/project/ai/app/ScalingAutomaticStrategy';
import { ScalingFixedStrategy } from '@/types/cloud/project/ai/app/ScalingFixedStrategy';

/** AI Solutions App Status Object */
export interface ScalingStrategy {
  /** Strategy setting a variable number of replicas, based on an average resource usage threshold */
  automatic?: ScalingAutomaticStrategy;
  /** Strategy setting a fix number of replicas */
  fixed?: ScalingFixedStrategy;
}
