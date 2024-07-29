import { ScalingAutomaticStrategyResourceTypeEnum } from '@/types/cloud/project/ai/app/ScalingAutomaticStrategyResourceTypeEnum';

/** AI Solutions App automatic scaling strategy object */
export interface ScalingAutomaticStrategy {
  /** The average resource usage threshold that the app upscale or downscale will be triggered from, in percent */
  averageUsageTarget?: number;
  /** Maximum number of replicas */
  replicasMax?: number;
  /** Minimum number of replicas */
  replicasMin?: number;
  /** Type of the resource to base the automatic scaling on */
  resourceType?: ScalingAutomaticStrategyResourceTypeEnum;
}
