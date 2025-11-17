import { z } from 'zod';
import { Scaling } from '@/types/orderFunnel';
import ai from '@/types/AI';

export const ResourceType = {
  ...ai.app.ScalingAutomaticStrategyResourceTypeEnum,
  CUSTOM: 'CUSTOM',
} as const;

export type ResourceType = typeof ResourceType[keyof typeof ResourceType];

export const SCALING_DEFAULTS = {
  AUTO_SCALING: false,
  MIN_REPLICAS: 1,
  MAX_REPLICAS: 1,
  AVERAGE_USAGE: 75,
  RESOURCE_TYPE: ResourceType.CPU,
  DATA_FORMAT: ai.app.CustomMetricsFormatEnum.JSON,
  AGGREGATION_TYPE: ai.app.CustomMetricsAggregationTypeEnum.AVERAGE,
  REPLICAS: 1,
} as const;

export type ScalingStrategySchema = {
  autoScaling?: boolean;
  replicas?: number;
  averageUsageTarget?: number;
  replicasMax?: number;
  replicasMin?: number;
  resourceType?: ResourceType;
  metricUrl?: string;
  dataFormat?: ai.app.CustomMetricsFormatEnum;
  dataLocation?: string;
  targetMetricValue?: number;
  aggregationType?: ai.app.CustomMetricsAggregationTypeEnum;
};

const URL_REGEX = /^https?:\/\/.+/;

export const baseScalingSchema = (t: (key: string) => string) =>
  z
    .object({
      autoScaling: z.boolean(),
      replicas: z.coerce
        .number()
        .min(1)
        .max(10),
      replicasMin: z.coerce
        .number()
        .min(1)
        .max(10)
        .optional(),
      replicasMax: z.coerce
        .number()
        .min(1)
        .max(10)
        .optional(),
      resourceType: z.nativeEnum(ResourceType).optional(),
      averageUsageTarget: z.coerce.number().optional(),
      metricUrl: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z
          .string()
          .trim()
          .regex(URL_REGEX, { message: t('metricUrlInvalid') })
          .optional(),
      ),
      dataFormat: z.nativeEnum(ai.app.CustomMetricsFormatEnum).optional(),
      dataLocation: z
        .string()
        .trim()
        .optional(),
      targetMetricValue: z.coerce.number().optional(),
      aggregationType: z
        .nativeEnum(ai.app.CustomMetricsAggregationTypeEnum)
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.autoScaling) return;
      if (data.replicasMin > data.replicasMax) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errorFormMinMaxRepField'),
          path: ['replicasMin'],
        });
      }
      if (data.resourceType === ResourceType.CUSTOM) {
        if (!data.metricUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('metricUrlRequired'),
            path: ['metricUrl'],
          });
        }
        if (!data.dataLocation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('dataLocationRequired'),
            path: ['dataLocation'],
          });
        }
      }
    });

export type FullScalingFormValues = z.infer<
  ReturnType<typeof baseScalingSchema>
>;

export const getInitialValues = (scaling: Scaling): FullScalingFormValues => ({
  autoScaling: scaling.autoScaling ?? SCALING_DEFAULTS.AUTO_SCALING,
  replicas: scaling.replicas ?? SCALING_DEFAULTS.REPLICAS,
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
