import { z } from 'zod';
import i18next from 'i18next';
import ai from '@/types/AI';

export const buildScalingSchema = (t: typeof i18next.t) =>
  z.object({
    scaling: z
      .object({
        autoScaling: z.boolean(),
        replicas: z.coerce.number(),
        averageUsageTarget: z.coerce.number(),
        replicasMax: z.coerce.number(),
        replicasMin: z.coerce.number(),
        resourceType: z
          .union([
            z.nativeEnum(ai.app.ScalingAutomaticStrategyResourceTypeEnum),
            z.literal('CUSTOM'),
          ])
          .optional(),
        metricUrl: z.string().optional(),
        dataFormat: z.nativeEnum(ai.app.CustomMetricsFormatEnum).optional(),
        dataLocation: z.string().optional(),
        targetMetricValue: z.number().optional(),
        aggregationType: z
          .nativeEnum(ai.app.CustomMetricsAggregationTypeEnum)
          .optional(),
      })
      .superRefine((data, ctx) => {
        if (data.resourceType === 'CUSTOM') {
          if (!data.metricUrl) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('metricUrlRequired'),
              path: ['metricUrl'],
            });
          }

          if (!data.dataFormat) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('dataFormatRequired'),
              path: ['dataFormat'],
            });
          }

          if (!data.dataLocation) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('dataLocationRequired'),
              path: ['dataLocation'],
            });
          }

          if (data.targetMetricValue === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('targetMetricValueRequired'),
              path: ['targetMetricValue'],
            });
          }

          if (!data.aggregationType) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('aggregationTypeRequired'),
              path: ['aggregationType'],
            });
          }
        }
      }),
  });

export type ScalingStrategySchema = z.infer<
  ReturnType<typeof buildScalingSchema>
>;
