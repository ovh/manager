import { z } from 'zod';
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

export const createScalingSchema = (t: (key: string) => string) => {
  const replicaFields = {
    replicasMin: z.coerce
      .number()
      .int()
      .min(1)
      .max(100),
    replicasMax: z.coerce
      .number()
      .int()
      .min(1)
      .max(100),
  };

  const cpuRamSchema = z.object({
    ...replicaFields,
    resourceType: z.nativeEnum(ai.app.ScalingAutomaticStrategyResourceTypeEnum),
    averageUsageTarget: z.coerce
      .number()
      .int()
      .min(0)
      .max(100),
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
    resourceType: z.literal('CUSTOM'),
    averageUsageTarget: z.coerce.number().optional(),
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
    .discriminatedUnion('resourceType', [cpuRamSchema, customSchema])
    .refine(({ replicasMin, replicasMax }) => replicasMax >= replicasMin, {
      message: t('errorFormMinMaxRepField'),
      path: ['replicasMax'],
    });
};

export type ScalingFormValues = z.infer<ReturnType<typeof createScalingSchema>>;

export const baseScalingSchema = z.object({
  autoScaling: z.boolean(),
  replicas: z.coerce.number(),
  replicasMin: z.coerce.number(),
  replicasMax: z.coerce.number(),
  resourceType: z.union([
    z.nativeEnum(ai.app.ScalingAutomaticStrategyResourceTypeEnum),
    z.literal('CUSTOM'),
  ]),
  averageUsageTarget: z.coerce.number().optional(),
  metricUrl: z.string().optional(),
  dataFormat: z.nativeEnum(ai.app.CustomMetricsFormatEnum).optional(),
  dataLocation: z.string().optional(),
  targetMetricValue: z.coerce.number().optional(),
  aggregationType: z
    .nativeEnum(ai.app.CustomMetricsAggregationTypeEnum)
    .optional(),
});

export type FullScalingFormValues = z.infer<typeof baseScalingSchema>;

export const toScaling = (
  base: Scaling,
  values: ScalingFormValues,
): Scaling => {
  const result: Scaling = {
    ...base,
    replicasMin: values.replicasMin,
    replicasMax: values.replicasMax,
    resourceType: values.resourceType,
  };

  if (values.resourceType === 'CUSTOM') {
    result.metricUrl = values.metricUrl;
    result.dataFormat = values.dataFormat;
    result.dataLocation = values.dataLocation;
    result.targetMetricValue = values.targetMetricValue;
    result.aggregationType = values.aggregationType;
  } else {
    result.averageUsageTarget = values.averageUsageTarget;
  }

  return result;
};

export const getInitialValues = (scaling: Scaling): ScalingFormValues => ({
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
