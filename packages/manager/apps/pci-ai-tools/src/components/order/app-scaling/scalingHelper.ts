import {
  FieldPath,
  FieldValues,
  Resolver,
  UseFormReturn,
  useWatch,
} from 'react-hook-form';
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
  COOLDOWN_PERIOD_SECONDS: 300,
  SCALE_UP_STABILIZATION_WINDOW_SECONDS: 0,
  SCALE_DOWN_STABILIZATION_WINDOW_SECONDS: 300,
} as const;

export const SCALING_CONSTRAINTS = {
  FIXED_REPLICAS: {
    MIN: 1,
    MAX: 10,
  },
  AUTO_REPLICAS: {
    MIN: 0,
    MAX: 10,
  },
  AVERAGE_USAGE_TARGET: {
    MIN: 0,
    MAX: 100,
  },
  SCALE_DELAY: {
    MIN: 0,
    MAX: 3600,
  },
  SCALE_TO_ZERO_DELAY: {
    MIN: 60,
  },
  TARGET_METRIC_VALUE: {
    MIN: 0,
    MAX: 100,
    STEP: 0.5,
  },
} as const;

export type ScalingStrategySchema = {
  autoScaling?: boolean;
  replicas?: number;
  averageUsageTarget?: number;
  replicasMax?: number;
  replicasMin?: number;
  cooldownPeriodSeconds?: number;
  scaleUpStabilizationWindowSeconds?: number;
  scaleDownStabilizationWindowSeconds?: number;
  resourceType?: ResourceType;
  metricUrl?: string;
  dataFormat?: ai.app.CustomMetricsFormatEnum;
  dataLocation?: string;
  targetMetricValue?: number;
  aggregationType?: ai.app.CustomMetricsAggregationTypeEnum;
};

const URL_REGEX = /^https?:\/\/.+/;
const emptyToUndefined = (value: unknown) =>
  value === '' || value === null || value === undefined ? undefined : value;

const behaviorScalingNumberSchema = z.preprocess(
  emptyToUndefined,
  z.coerce
    .number()
    .catch(undefined)
    .optional(),
);
const behaviorScalingIntSchema = z.preprocess(
  emptyToUndefined,
  z.coerce
    .number()
    .int()
    .catch(undefined)
    .optional(),
);
const optionalScalingNumberSchema = z.preprocess(
  emptyToUndefined,
  z.coerce.number().optional(),
);
const replicasMinBehaviorSchema = behaviorScalingIntSchema;
const replicasMaxBehaviorSchema = behaviorScalingIntSchema;
const replicasBehaviorSchema = z
  .object({
    replicasMin: replicasMinBehaviorSchema,
    replicasMax: replicasMaxBehaviorSchema,
  })
  .transform(({ replicasMin, replicasMax }) => {
    const minReplicasMax = Math.max(
      SCALING_CONSTRAINTS.FIXED_REPLICAS.MIN,
      replicasMin ?? SCALING_CONSTRAINTS.FIXED_REPLICAS.MIN,
    );
    const normalizedReplicasMax =
      replicasMin !== undefined &&
      (replicasMax === undefined || replicasMax < minReplicasMax)
        ? minReplicasMax
        : replicasMax;

    return {
      minReplicasMax,
      normalizedReplicasMax,
      showScaleToZero: replicasMin === 0,
    };
  });

const getScalingNumberValue = (value: unknown) => {
  return behaviorScalingNumberSchema.parse(value);
};

interface ScalingStrategyFormStateInput {
  averageUsageTarget: unknown;
  replicasMin: unknown;
  resourceType: unknown;
}

const getReplicasBehavior = (replicasMin: unknown, replicasMax: unknown) => {
  return replicasBehaviorSchema.parse({
    replicasMin,
    replicasMax,
  });
};

const getScalingStrategyFormState = ({
  averageUsageTarget,
  replicasMin,
  resourceType,
}: ScalingStrategyFormStateInput) => {
  const parsedAverageUsageTarget = optionalScalingNumberSchema.safeParse(
    averageUsageTarget,
  );
  const replicasBehavior = getReplicasBehavior(replicasMin, undefined);
  return {
    averageUsageTargetValue:
      parsedAverageUsageTarget.success &&
      parsedAverageUsageTarget.data !== undefined
        ? parsedAverageUsageTarget.data
        : SCALING_DEFAULTS.AVERAGE_USAGE,
    isCustom: resourceType === ResourceType.CUSTOM,
    showScaleToZero: replicasBehavior.showScaleToZero,
  };
};

export const baseScalingSchema = (t: (key: string) => string) =>
  z
    .object({
      autoScaling: z.boolean(),
      replicas: z.coerce
        .number()
        .int()
        .min(SCALING_CONSTRAINTS.FIXED_REPLICAS.MIN)
        .max(SCALING_CONSTRAINTS.FIXED_REPLICAS.MAX),
      replicasMin: z.preprocess(
        emptyToUndefined,
        z.coerce
          .number()
          .int()
          .min(SCALING_CONSTRAINTS.AUTO_REPLICAS.MIN, {
            message: t('replicasMinRangeError'),
          })
          .max(SCALING_CONSTRAINTS.AUTO_REPLICAS.MAX, {
            message: t('replicasMinRangeError'),
          })
          .optional(),
      ),
      replicasMax: z.preprocess(
        emptyToUndefined,
        z.coerce
          .number()
          .int()
          .min(SCALING_CONSTRAINTS.FIXED_REPLICAS.MIN, {
            message: t('replicasMaxRangeError'),
          })
          .max(SCALING_CONSTRAINTS.FIXED_REPLICAS.MAX, {
            message: t('replicasMaxRangeError'),
          })
          .optional(),
      ),
      cooldownPeriodSeconds: z.preprocess(
        emptyToUndefined,
        z.coerce
          .number()
          .int()
          .min(SCALING_CONSTRAINTS.SCALE_DELAY.MIN, {
            message: t('scaleDelayRangeError'),
          })
          .max(SCALING_CONSTRAINTS.SCALE_DELAY.MAX, {
            message: t('scaleDelayRangeError'),
          })
          .optional(),
      ),
      scaleUpStabilizationWindowSeconds: z.preprocess(
        emptyToUndefined,
        z.coerce
          .number()
          .int()
          .min(SCALING_CONSTRAINTS.SCALE_DELAY.MIN, {
            message: t('scaleDelayRangeError'),
          })
          .max(SCALING_CONSTRAINTS.SCALE_DELAY.MAX, {
            message: t('scaleDelayRangeError'),
          })
          .optional(),
      ),
      scaleDownStabilizationWindowSeconds: z.preprocess(
        emptyToUndefined,
        z.coerce
          .number()
          .int()
          .min(SCALING_CONSTRAINTS.SCALE_DELAY.MIN, {
            message: t('scaleDelayRangeError'),
          })
          .max(SCALING_CONSTRAINTS.SCALE_DELAY.MAX, {
            message: t('scaleDelayRangeError'),
          })
          .optional(),
      ),
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
      targetMetricValue: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.coerce
          .number()
          .finite()
          .min(SCALING_CONSTRAINTS.TARGET_METRIC_VALUE.MIN)
          .max(SCALING_CONSTRAINTS.TARGET_METRIC_VALUE.MAX)
          .optional(),
      ),
      aggregationType: z
        .nativeEnum(ai.app.CustomMetricsAggregationTypeEnum)
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.autoScaling) return;
      if (
        data.replicasMin === 0 &&
        (data.cooldownPeriodSeconds === undefined ||
          data.cooldownPeriodSeconds <
            SCALING_CONSTRAINTS.SCALE_TO_ZERO_DELAY.MIN)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('scaleToZeroDelayRangeError'),
          path: ['cooldownPeriodSeconds'],
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
        if (data.targetMetricValue == null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('targetMetricValueRequired'),
            path: ['targetMetricValue'],
          });
        }
      }
    })
    .transform((data) => {
      const replicasBehavior = getReplicasBehavior(
        data.replicasMin,
        data.replicasMax,
      );

      return {
        ...data,
        replicasMax: replicasBehavior.normalizedReplicasMax,
      };
    });

export function withScalingResolverSync<
  TFieldValues extends FieldValues & ScalingStrategySchema
>(resolver: Resolver<TFieldValues>): Resolver<TFieldValues> {
  return async (values, context, options) => {
    const names = options.names ? ([...options.names] as string[]) : undefined;

    if (names?.includes('replicasMin') && !names.includes('replicasMax')) {
      names.push('replicasMax');
    }

    return resolver(
      values,
      context,
      names ? { ...options, names: names as typeof options.names } : options,
    );
  };
}

export type FullScalingFormValues = z.infer<
  ReturnType<typeof baseScalingSchema>
>;

export function useScalingStrategyForm<
  TFieldValues extends FieldValues & ScalingStrategySchema
>(form: UseFormReturn<TFieldValues>) {
  const [
    autoScaling,
    averageUsageTarget,
    replicasMin,
    replicasMax,
    resourceType,
  ] = useWatch({
    control: form.control,
    name: [
      'autoScaling' as FieldPath<TFieldValues>,
      'averageUsageTarget' as FieldPath<TFieldValues>,
      'replicasMin' as FieldPath<TFieldValues>,
      'replicasMax' as FieldPath<TFieldValues>,
      'resourceType' as FieldPath<TFieldValues>,
    ],
  });

  const {
    averageUsageTargetValue,
    isCustom,
    showScaleToZero,
  } = getScalingStrategyFormState({
    averageUsageTarget,
    replicasMin,
    resourceType,
  });

  const syncReplicasMaxFromMin = (replicasMinValue?: unknown) => {
    const normalizedReplicasMinValue = getScalingNumberValue(
      replicasMinValue ??
        form.getValues('replicasMin' as FieldPath<TFieldValues>),
    );
    form.setValue(
      'replicasMin' as FieldPath<TFieldValues>,
      normalizedReplicasMinValue as TFieldValues[FieldPath<TFieldValues>],
      {
        shouldDirty: true,
        shouldValidate: false,
      },
    );

    const currentReplicasMaxValue = getScalingNumberValue(
      form.getValues('replicasMax' as FieldPath<TFieldValues>),
    );
    const replicasBehavior = getReplicasBehavior(
      normalizedReplicasMinValue,
      currentReplicasMaxValue,
    );
    const normalizedReplicasMaxValue = replicasBehavior.normalizedReplicasMax;

    if (
      normalizedReplicasMaxValue !== undefined &&
      normalizedReplicasMaxValue !== currentReplicasMaxValue
    ) {
      form.setValue(
        'replicasMax' as FieldPath<TFieldValues>,
        normalizedReplicasMaxValue as TFieldValues[FieldPath<TFieldValues>],
        {
          shouldDirty: true,
          shouldValidate: false,
        },
      );
    }

    void form.trigger([
      'replicasMin' as FieldPath<TFieldValues>,
      'replicasMax' as FieldPath<TFieldValues>,
    ]);
  };

  return {
    autoScaling: Boolean(autoScaling),
    averageUsageTargetValue,
    isCustom,
    syncReplicasMaxFromMin,
    showScaleToZero,
  };
}

export const getInitialValues = (scaling: Scaling): FullScalingFormValues => ({
  autoScaling: scaling.autoScaling ?? SCALING_DEFAULTS.AUTO_SCALING,
  replicas: scaling.replicas ?? SCALING_DEFAULTS.REPLICAS,
  replicasMin: scaling.replicasMin ?? SCALING_DEFAULTS.MIN_REPLICAS,
  replicasMax: scaling.replicasMax ?? SCALING_DEFAULTS.MAX_REPLICAS,
  cooldownPeriodSeconds:
    scaling.cooldownPeriodSeconds ?? SCALING_DEFAULTS.COOLDOWN_PERIOD_SECONDS,
  scaleUpStabilizationWindowSeconds:
    scaling.scaleUpStabilizationWindowSeconds ??
    SCALING_DEFAULTS.SCALE_UP_STABILIZATION_WINDOW_SECONDS,
  scaleDownStabilizationWindowSeconds:
    scaling.scaleDownStabilizationWindowSeconds ??
    SCALING_DEFAULTS.SCALE_DOWN_STABILIZATION_WINDOW_SECONDS,
  resourceType: scaling.resourceType ?? SCALING_DEFAULTS.RESOURCE_TYPE,
  averageUsageTarget:
    scaling.averageUsageTarget ?? SCALING_DEFAULTS.AVERAGE_USAGE,
  metricUrl: scaling.metricUrl ?? '',
  dataFormat: scaling.dataFormat ?? SCALING_DEFAULTS.DATA_FORMAT,
  dataLocation: scaling.dataLocation ?? '',
  targetMetricValue: scaling.targetMetricValue ?? 0,
  aggregationType: scaling.aggregationType ?? SCALING_DEFAULTS.AGGREGATION_TYPE,
});
