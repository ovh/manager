import { z } from 'zod';
import storages from '@/types/Storages';
import { STORAGE_CLASS_TIER } from '@/hooks/useAvailableStorageClasses.hook';
import {
  MIN_TRANSITION_GAP_DAYS,
  getMaxTransitionDays,
} from './lifecycleTransition.utils';

export const DEFAULT_EXPIRATION_DAYS = 1;

type TFunction = (key: string) => string;

const validateTransitionGaps = (
  transitions: Array<{
    storageClass?: storages.StorageClassEnum;
    days?: number;
  }>,
  pathPrefix: string,
  daysKey: string,
  t: TFunction,
  ctx: z.RefinementCtx,
) => {
  if (transitions.length <= 1) return;

  const indexed = transitions.map((tr, originalIndex) => ({
    storageClass: tr.storageClass ?? storages.StorageClassEnum.STANDARD,
    days: tr.days ?? 0,
    originalIndex,
  }));

  const sorted = indexed.sort(
    (a, b) =>
      STORAGE_CLASS_TIER[a.storageClass] - STORAGE_CLASS_TIER[b.storageClass],
  );

  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].days - sorted[i - 1].days < MIN_TRANSITION_GAP_DAYS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('formTransitionMinGapError'),
        path: [pathPrefix, sorted[i].originalIndex, daysKey],
      });
    }
  }
};

const validateExpirationAfterTransitions = (
  hasCurrentVersionTransitions: boolean,
  hasCurrentVersionExpiration: boolean,
  expirationDays: number,
  transitions: Array<{ days?: number }>,
  expirationPath: string,
  t: TFunction,
  ctx: z.RefinementCtx,
) => {
  if (
    !hasCurrentVersionTransitions ||
    !hasCurrentVersionExpiration ||
    expirationDays <= 0 ||
    transitions.length === 0
  )
    return;

  const maxDays = getMaxTransitionDays(
    transitions.map((tr) => ({ days: tr.days ?? 0 })),
  );
  if (expirationDays <= maxDays) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('formExpirationAfterTransitionsError'),
      path: [expirationPath],
    });
  }
};

export const createLifecycleSchema = (t: TFunction) =>
  z
    .object({
      ruleId: z
        .string()
        .min(1, t('formRuleIdRequired'))
        .max(255, t('formRuleIdMaxLength')),
      status: z
        .nativeEnum(storages.LifecycleRuleStatusEnum)
        .default(storages.LifecycleRuleStatusEnum.enabled),

      hasFilter: z.boolean().default(false),
      prefix: z.string().default(''),
      tags: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
          }),
        )
        .default([]),

      hasCurrentVersionTransitions: z.boolean().default(false),
      transitions: z
        .array(
          z.object({
            days: z.coerce
              .number()
              .int()
              .min(MIN_TRANSITION_GAP_DAYS, t('formTransitionMinDaysError')),
            storageClass: z.nativeEnum(storages.StorageClassEnum, {
              message: t('formStorageClassRequiredError'),
            }),
          }),
        )
        .default([]),

      hasCurrentVersionExpiration: z.boolean().default(false),
      expirationDays: z.coerce
        .number()
        .int()
        .min(0)
        .default(DEFAULT_EXPIRATION_DAYS),
      expiredObjectDeleteMarker: z.boolean().default(false),

      hasNoncurrentVersionTransitions: z.boolean().default(false),
      noncurrentVersionTransitions: z
        .array(
          z.object({
            noncurrentDays: z.coerce
              .number()
              .int()
              .min(MIN_TRANSITION_GAP_DAYS, t('formTransitionMinDaysError')),
            storageClass: z.nativeEnum(storages.StorageClassEnum, {
              message: t('formStorageClassRequiredError'),
            }),
            newerNoncurrentVersions: z.coerce
              .number()
              .int()
              .min(0)
              .default(0),
          }),
        )
        .default([]),

      hasNoncurrentVersionExpiration: z.boolean().default(false),
      noncurrentVersionExpirationDays: z.coerce
        .number()
        .int()
        .min(0)
        .default(0),
      noncurrentVersionExpirationNewerVersions: z.coerce
        .number()
        .int()
        .min(0)
        .default(0),

      hasObjectSizeGreaterThan: z.boolean().default(false),
      objectSizeGreaterThan: z.coerce
        .number()
        .int()
        .min(0)
        .default(0),
      hasObjectSizeLessThan: z.boolean().default(false),
      objectSizeLessThan: z.coerce
        .number()
        .int()
        .min(0)
        .default(0),

      hasAbortIncompleteMultipartUpload: z.boolean().default(false),
      abortDaysAfterInitiation: z.coerce
        .number()
        .int()
        .min(0)
        .default(0),
    })
    .superRefine((data, ctx) => {
      const hasAtLeastOneOperation =
        data.hasCurrentVersionTransitions ||
        data.hasCurrentVersionExpiration ||
        data.expiredObjectDeleteMarker ||
        data.hasNoncurrentVersionTransitions ||
        data.hasNoncurrentVersionExpiration ||
        data.hasAbortIncompleteMultipartUpload;

      if (!hasAtLeastOneOperation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('formAtLeastOneOperationError'),
          path: [],
        });
      }

      if (
        data.hasFilter &&
        data.hasObjectSizeGreaterThan &&
        data.hasObjectSizeLessThan &&
        data.objectSizeGreaterThan > 0 &&
        data.objectSizeLessThan > 0 &&
        data.objectSizeGreaterThan >= data.objectSizeLessThan
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('formObjectSizeRangeError'),
          path: ['objectSizeGreaterThan'],
        });
      }

      if (data.hasFilter && data.tags) {
        data.tags.forEach((tag, index) => {
          if (tag.key.trim() === '' && tag.value.trim() !== '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('formTagKeyRequired'),
              path: ['tags', index, 'key'],
            });
          }
        });
      }

      if (data.hasCurrentVersionTransitions) {
        validateTransitionGaps(data.transitions, 'transitions', 'days', t, ctx);
      }

      if (data.hasNoncurrentVersionTransitions) {
        validateTransitionGaps(
          data.noncurrentVersionTransitions.map((tr) => ({
            storageClass: tr.storageClass,
            days: tr.noncurrentDays,
          })),
          'noncurrentVersionTransitions',
          'noncurrentDays',
          t,
          ctx,
        );
      }

      validateExpirationAfterTransitions(
        data.hasCurrentVersionTransitions,
        data.hasCurrentVersionExpiration,
        data.expirationDays,
        data.transitions,
        'expirationDays',
        t,
        ctx,
      );

      validateExpirationAfterTransitions(
        data.hasNoncurrentVersionTransitions,
        data.hasNoncurrentVersionExpiration,
        data.noncurrentVersionExpirationDays,
        data.noncurrentVersionTransitions.map((tr) => ({
          days: tr.noncurrentDays,
        })),
        'noncurrentVersionExpirationDays',
        t,
        ctx,
      );
    });
