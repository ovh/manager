import { useMemo } from 'react';

import { InfraStructureExtraSettingsDuration } from '@/types/infrastructures.type';
import {
  ObservabilityDurationUnit,
  formatObservabilityDuration,
  parseObservabilityDurationValue,
} from '@/utils/duration.utils';

import { useDateFnsLocale } from './useDateFnsLocale.hook';

export type FormattedDurationValue = {
  value: number;
  label: string;
};

export type FormattedExtraSettingsDuration = {
  unit: ObservabilityDurationUnit;
  default: FormattedDurationValue;
  max?: FormattedDurationValue;
  min?: FormattedDurationValue;
};

/**
 * Hook to format an InfraStructureExtraSettingsDuration into a structured object.
 * Uses the current locale from i18n for proper internationalization.
 *
 * @param setting - The duration setting to format (e.g., compactor_blocks_retention_period)
 * @returns Formatted setting with unit, value, and human-readable label
 *
 * @example
 * const formatted = useFormattedDurationSetting(extraSettings?.mimir?.compactor_blocks_retention_period);
 * // formatted?.unit => "d"
 * // formatted?.default.value => 7
 * // formatted?.default.label => "7 days"
 */
export const useFormattedDurationSetting = (
  setting: InfraStructureExtraSettingsDuration | undefined,
): FormattedExtraSettingsDuration | undefined => {
  const locale = useDateFnsLocale();

  return useMemo(() => {
    if (!setting) {
      return undefined;
    }

    const parsedDefault = parseObservabilityDurationValue(setting.default);

    const parsedMax = setting.max ? parseObservabilityDurationValue(setting.max) : undefined;
    const parsedMin = setting.min ? parseObservabilityDurationValue(setting.min) : undefined;

    return {
      unit: parsedDefault.unit,
      default: {
        value: parsedDefault.value,
        label: formatObservabilityDuration(setting.default, locale),
      },
      max: parsedMax
        ? {
            value: parsedMax.value,
            label: formatObservabilityDuration(setting.max as string, locale),
          }
        : undefined,
      min: parsedMin
        ? {
            value: parsedMin.value,
            label: formatObservabilityDuration(setting.min as string, locale),
          }
        : undefined,
    };
  }, [setting, locale]);
};
