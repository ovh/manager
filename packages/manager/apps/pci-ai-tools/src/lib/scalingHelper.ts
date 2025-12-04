import { z } from 'zod';
import { Scaling } from '@/types/orderFunnel';
import ai from '@/types/AI';

export type ScalingFormValues = z.infer<ReturnType<typeof createScalingSchema>>;

export const SCALING_DEFAULTS = {
  MIN_REPLICAS: 1,
  MAX_REPLICAS: 1,
  AVERAGE_USAGE: 75,
  RESOURCE_TYPE: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
  DATA_FORMAT: ai.app.CustomMetricsFormatEnum.JSON,
  AGGREGATION_TYPE: ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
} as const;

export const createScalingSchema = (t: (key: string) => string) => {
  const replicaFields = {
    minRep: z.coerce.number().int().min(1).max(100),
    maxRep: z.coerce.number().int().min(1).max(100),
  };

  const cpuRamSchema = z.object({
    ...replicaFields,
    resType: z.nativeEnum(ai.app.ScalingAutomaticStrategyResourceTypeEnum),
    averageUsage: z.coerce.number().int().min(0).max(100),
    metricUrl: z.string().optional(),
    dataFormat: z.nativeEnum(ai.app.CustomMetricsFormatEnum).optional(),
    dataLocation: z.string().optional(),
    targetMetricValue: z.coerce.number().optional(),
    aggregationType: z
      .nativeEnum(ai.app.CustomMetricsAggregationTypeEnum)
      .optional(),
  });

  const customSchema = z.object({
    ...replicaFields,
    resType: z.literal('CUSTOM'),
    averageUsage: z.coerce.number().optional(),
    metricUrl: z.string().min(1, t('metricUrlRequired')),
    dataFormat: z.nativeEnum(ai.app.CustomMetricsFormatEnum, {
      required_error: t('dataFormatRequired'),
    }),
    dataLocation: z.string().min(1, t('dataLocationRequired')),
    targetMetricValue: z.coerce
      .number({ required_error: t('targetMetricValueRequired') })
      .min(0, t('targetMetricValueMinimum')),
    aggregationType: z.nativeEnum(ai.app.CustomMetricsAggregationTypeEnum, {
      required_error: t('aggregationTypeRequired'),
    }),
  });

  return z
    .discriminatedUnion('resType', [cpuRamSchema, customSchema])
    .refine(({ minRep, maxRep }) => maxRep >= minRep, {
      message: t('errorFormMinMaxRepField'),
      path: ['maxRep'],
    });
};

export const toScaling = (
  base: Scaling,
  values: ScalingFormValues,
): Scaling => ({
  ...base,
  replicasMin: values.minRep,
  replicasMax: values.maxRep,
  averageUsageTarget: values.averageUsage,
  resourceType: values.resType,
  metricUrl: values.metricUrl,
  dataFormat: values.dataFormat,
  dataLocation: values.dataLocation,
  targetMetricValue: values.targetMetricValue,
  aggregationType: values.aggregationType,
});

export const getInitialValues = (scaling: Scaling): ScalingFormValues => ({
  minRep: scaling.replicasMin ?? SCALING_DEFAULTS.MIN_REPLICAS,
  maxRep: scaling.replicasMax ?? SCALING_DEFAULTS.MAX_REPLICAS,
  resType: scaling.resourceType ?? SCALING_DEFAULTS.RESOURCE_TYPE,
  averageUsage: scaling.averageUsageTarget ?? SCALING_DEFAULTS.AVERAGE_USAGE,
  metricUrl: scaling.metricUrl ?? '',
  dataFormat: scaling.dataFormat ?? SCALING_DEFAULTS.DATA_FORMAT,
  dataLocation: scaling.dataLocation ?? '',
  targetMetricValue: scaling.targetMetricValue,
  aggregationType: scaling.aggregationType ?? SCALING_DEFAULTS.AGGREGATION_TYPE,
});
