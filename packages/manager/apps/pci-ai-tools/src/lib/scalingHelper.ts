import { z } from 'zod';
import i18next from 'i18next';
import { Scaling } from '@/types/orderFunnel';
import ai from '@/types/AI';

export const SCALING_DEFAULTS = {
  MIN_REPLICAS: 1,
  MAX_REPLICAS: 1,
  AVERAGE_USAGE: 75,
  RESOURCE_TYPE: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
  DATA_FORMAT: ai.app.CustomMetricsFormatEnum.JSON,
  AGGREGATION_TYPE: ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
} as const;

export type ScalingStrategySchema = {
  autoScaling?: boolean;
  replicas?: number;
  averageUsageTarget?: number;
  replicasMax?: number;
  replicasMin?: number;
  resourceType?: ai.app.ScalingAutomaticStrategyResourceTypeEnum | 'CUSTOM';
  metricUrl?: string;
  dataFormat?: ai.app.CustomMetricsFormatEnum;
  dataLocation?: string;
  targetMetricValue?: number;
  aggregationType?: ai.app.CustomMetricsAggregationTypeEnum;
};

export const baseScalingSchema = z
  .object({
    autoScaling: z.boolean(),
    replicas: z.coerce.number(),
    replicasMin: z.coerce.number().optional(),
    replicasMax: z.coerce.number().optional(),
    resourceType: z
      .union([
        z.nativeEnum(ai.app.ScalingAutomaticStrategyResourceTypeEnum),
        z.literal('CUSTOM'),
      ])
      .optional(),
    averageUsageTarget: z.coerce.number().optional(),
    metricUrl: z.string().optional(),
    dataFormat: z.nativeEnum(ai.app.CustomMetricsFormatEnum).optional(),
    dataLocation: z.string().optional(),
    targetMetricValue: z.coerce.number().optional(),
    aggregationType: z
      .nativeEnum(ai.app.CustomMetricsAggregationTypeEnum)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.autoScaling && data.resourceType === 'CUSTOM') {
      if (!data.metricUrl || data.metricUrl.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Metric URL is required',
          path: ['metricUrl'],
        });
      }

      if (!data.dataLocation || data.dataLocation.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Data location is required',
          path: ['dataLocation'],
        });
      }
    }
  });

export type FullScalingFormValues = z.infer<typeof baseScalingSchema>;

export const getInitialValues = (
  scaling: Scaling,
): Partial<FullScalingFormValues> => ({
  replicasMin: scaling.replicasMin ?? SCALING_DEFAULTS.MIN_REPLICAS,
  replicasMax: scaling.replicasMax ?? SCALING_DEFAULTS.MAX_REPLICAS,
  resourceType: scaling.resourceType ?? SCALING_DEFAULTS.RESOURCE_TYPE,
  averageUsageTarget:
    scaling.averageUsageTarget ?? SCALING_DEFAULTS.AVERAGE_USAGE,
  metricUrl: scaling.metricUrl ?? '',
  dataFormat: scaling.dataFormat ?? SCALING_DEFAULTS.DATA_FORMAT,
  dataLocation: scaling.dataLocation ?? '',
  targetMetricValue: scaling.targetMetricValue ?? 0,
  aggregationType: scaling.aggregationType ?? SCALING_DEFAULTS.AGGREGATION_TYPE,
});
