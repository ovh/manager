import { z } from 'zod';
import i18next from 'i18next';
import storages from '@/types/Storages';

// Duration limits by unit
export const durationLimits = {
  D: 36500,
  Y: 100,
};

// Get max value for current unit
export const getMaxDurationValue = (unit: string) => {
  return durationLimits[unit as keyof typeof durationLimits] || 100;
};

export const createObjectLockOptionsSchema = (t: typeof i18next.t) => {
  // schema definition
  return z
    .object({
      status: z.nativeEnum(storages.ObjectLockStatusEnum),
      retention: z.boolean(),
      rule: z
        .object({
          mode: z.nativeEnum(storages.ObjectLockModeEnum),
          durationValue: z.number().min(1, t('errorDurationMin')),
          durationUnit: z.enum(['D', 'M', 'Y']),
        })
        .optional()
        .nullable(),
    })
    .superRefine((data, ctx) => {
      if (!data.retention) {
        return; // Skip all validation if retention is disabled
      }

      // When retention is enabled, rule must be valid
      if (!data.rule) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errorRuleRequired'),
          path: ['rule'],
        });
        return;
      }

      // Validate rule fields
      const { durationValue, durationUnit } = data.rule;
      const max = durationUnit === 'D' ? durationLimits.D : durationLimits.Y;

      if (durationValue > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errorDurationMax'),
          path: ['rule', 'durationValue'],
        });
      }
    });
};
