import React, { useEffect, useMemo, useRef } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  Quantity,
  QuantityControl,
  QuantityInput,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TEXT_PRESET, Text, useDateFnsLocale } from '@ovh-ux/muk';

import { BoundsFormFieldHelper } from '@/components/form/bounds-form-field-helper/BoundsFormFieldHelper.component';
import { TenantConfigurationFormProps } from '@/components/metrics/tenant-configuration-form/TenantConfigurationForm.props';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useInfrastructureSettings } from '@/data/hooks/infrastructures/useInfrastructureSettings.hook';
import { useDynamicBoundsValidation } from '@/hooks/form/useDynamicBoundsValidation.hook';
import { useFormattedDurationSetting } from '@/hooks/useFormattedExtraSettings.hook';
import type { TenantFormData } from '@/types/tenants.type';
import { toRequiredLabel } from '@/utils/form.utils';
import { formatNumberWithLocale } from '@/utils/number.utils';

export const TenantConfigurationForm = ({ onBoundsErrorChange }: TenantConfigurationFormProps) => {
  const { t } = useTranslation(['tenants', NAMESPACES.FORM]);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TenantFormData>();

  const { selectedService } = useObservabilityServiceContext();
  const dateFnsLocale = useDateFnsLocale();

  const infrastructureId = useWatch({
    control,
    name: 'infrastructureId',
  });

  const retentionDuration = useWatch({
    control,
    name: 'retentionDuration',
  });

  const maxSeries = useWatch({
    control,
    name: 'maxSeries',
  });

  const { data: extraSettings } = useInfrastructureSettings(
    selectedService?.id || '',
    infrastructureId || '',
  );

  const retentionSetting = useFormattedDurationSetting(
    extraSettings?.mimir?.configurable?.compactor_blocks_retention_period,
  );

  const maxSeriesSetting = extraSettings?.mimir?.configurable?.max_global_series_per_user;

  const settingBounds = useMemo(
    () => ({
      retention: {
        min: retentionSetting?.min,
        max: retentionSetting?.max,
      },
      maxSeries: {
        min: maxSeriesSetting?.min,
        max: maxSeriesSetting?.max,
      },
    }),
    [retentionSetting, maxSeriesSetting],
  );

  // Track if default value has been initialized for this infrastructure
  const initializedForInfrastructureRef = useRef<string | null>(null);

  // Set default values only once when setting becomes available
  useEffect(() => {
    if (
      retentionSetting?.default.value &&
      maxSeriesSetting?.default &&
      infrastructureId &&
      initializedForInfrastructureRef.current !== infrastructureId
    ) {
      setValue('retentionDuration', retentionSetting.default.value.toString());
      setValue('retentionUnit', retentionSetting.unit);
      setValue('maxSeries', maxSeriesSetting.default);
      initializedForInfrastructureRef.current = infrastructureId;
    }
  }, [retentionSetting, maxSeriesSetting, infrastructureId, setValue]);

  // Validate bounds dynamically (bounds depend on selected infrastructure)
  const retentionValue = retentionDuration ? parseInt(retentionDuration, 10) : null;

  const hasRetentionError = useDynamicBoundsValidation<TenantFormData>(
    'retentionDuration',
    retentionValue,
    {
      min: settingBounds.retention.min?.value,
      max: settingBounds.retention.max?.value,
    },
  );

  const hasMaxSeriesError = useDynamicBoundsValidation<TenantFormData>(
    'maxSeries',
    maxSeries,
    settingBounds.maxSeries,
  );

  // Notify parent of bounds error state changes
  const hasBoundsError = hasRetentionError || hasMaxSeriesError;
  const prevHasBoundsErrorRef = useRef(hasBoundsError);
  useEffect(() => {
    if (prevHasBoundsErrorRef.current !== hasBoundsError) {
      prevHasBoundsErrorRef.current = hasBoundsError;
      onBoundsErrorChange?.(hasBoundsError);
    }
  }, [hasBoundsError, onBoundsErrorChange]);

  return (
    <>
      <Text preset={TEXT_PRESET.heading2}>{t('configuration.title')}</Text>
      <div className="mt-6">
        <Controller
          name="retentionDuration"
          control={control}
          render={({ field }) => (
            <FormField className="my-6 block">
              <FormFieldLabel>
                <Text preset={TEXT_PRESET.paragraph}>
                  {toRequiredLabel(
                    t('tenants:configuration.retention.title'),
                    t(`${NAMESPACES.FORM}:required`),
                  )}
                </Text>
              </FormFieldLabel>
              <Quantity
                name="retention-quantity"
                min={settingBounds.retention.min?.value}
                max={settingBounds.retention.max?.value}
                value={field.value?.toString() || ''}
                onValueChange={(detail) => field.onChange(detail.value ?? '')}
                invalid={!!errors.retentionDuration || hasRetentionError}
                disabled={!infrastructureId || !retentionSetting}
              >
                <QuantityControl>
                  <QuantityInput className="w-24" />
                </QuantityControl>
              </Quantity>

              <BoundsFormFieldHelper
                min={settingBounds.retention?.min?.label}
                max={settingBounds.retention?.max?.label}
                error={errors.retentionDuration}
                hasRetentionError={hasRetentionError}
              />
            </FormField>
          )}
        />

        <Controller
          name="maxSeries"
          control={control}
          render={({ field }) => (
            <FormField className="my-6 block">
              <FormFieldLabel>
                <Text preset={TEXT_PRESET.paragraph}>
                  {toRequiredLabel(
                    t('tenants:configuration.limit.title'),
                    t(`${NAMESPACES.FORM}:required`),
                  )}
                </Text>
              </FormFieldLabel>
              <Quantity
                name="limit-quantity"
                min={settingBounds.maxSeries?.min}
                max={settingBounds.maxSeries?.max}
                value={field.value?.toString() || ''}
                onValueChange={(detail) =>
                  field.onChange(detail.value ? parseInt(detail.value, 10) : null)
                }
                invalid={!!errors.maxSeries || hasMaxSeriesError}
                disabled={!infrastructureId}
              >
                <QuantityControl>
                  <QuantityInput className="w-24" />
                </QuantityControl>
              </Quantity>
              <BoundsFormFieldHelper
                min={formatNumberWithLocale(settingBounds.maxSeries?.min, dateFnsLocale)}
                max={formatNumberWithLocale(settingBounds.maxSeries?.max, dateFnsLocale)}
                error={errors.maxSeries}
                hasRetentionError={hasMaxSeriesError}
              />
            </FormField>
          )}
        />
      </div>
    </>
  );
};
