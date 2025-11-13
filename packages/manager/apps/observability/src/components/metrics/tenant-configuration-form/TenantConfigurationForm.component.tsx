import React from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldHelper,
  Quantity,
  QuantityControl,
  QuantityInput,
  TEXT_PRESET,
  Text,
} from '@ovh-ux/muk';

import { SelectField } from '@/components/form/select-field/SelectField.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useRetentions } from '@/data/hooks/infrastructures/useRetentions.hook';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import type { TenantFormData } from '@/types/tenants.type';
import { formatDuration } from '@/utils/duration.utils';
import { toRequiredLabel } from '@/utils/form.utils';
import { INGESTION_BOUNDS } from '@/utils/tenants.constants';

export const TenantConfigurationForm = () => {
  const { t } = useTranslation('tenants');
  const {
    control,
    formState: { errors },
  } = useFormContext<TenantFormData>();

  const { selectedService } = useObservabilityServiceContext();
  const dateFnsLocale = useDateFnsLocale();

  // Watch the infrastructureId field to use it for fetching retentions
  const infrastructureId = useWatch({
    control,
    name: 'infrastructureId',
  });

  const {
    data: retentions,
    isPending,
    isLoading,
  } = useRetentions({
    resourceName: selectedService?.id || '',
    infrastructureId: infrastructureId || '',
  });

  return (
    <>
      <Text preset={TEXT_PRESET.heading4}>{t('configuration.title')}</Text>
      <div className="space-y-4">
        <Controller
          name="retentionId"
          control={control}
          render={({ field }) => (
            <SelectField
              key={infrastructureId || 'no-infrastructure'}
              isDisabled={!infrastructureId || isPending}
              isLoading={isLoading}
              value={field.value}
              name="select-retention"
              label={toRequiredLabel(t('configuration.retention'))}
              placeholder={t('configuration.retentionPlaceholder')}
              onChange={(value) => field.onChange(value ?? '')}
              options={retentions?.map((option) => ({
                value: option.id,
                label: formatDuration(option.duration, dateFnsLocale),
              }))}
              error={errors.retentionId?.message}
            />
          )}
        />

        <Text preset={TEXT_PRESET.heading6}>{t('configuration.limit.title')}</Text>
        <Text preset={TEXT_PRESET.paragraph}>{t('configuration.limit.description')}</Text>

        <Controller
          name="maxSeries"
          control={control}
          render={({ field }) => (
            <FormField className="block">
              <Quantity
                name="limit-quantity"
                min={INGESTION_BOUNDS.MIN}
                max={INGESTION_BOUNDS.MAX}
                value={field.value?.toString() || ''}
                onValueChange={(detail) =>
                  field.onChange(detail.value ? parseInt(detail.value, 10) : null)
                }
                invalid={!!errors.maxSeries}
              >
                <QuantityControl>
                  <QuantityInput />
                </QuantityControl>
              </Quantity>
              <FormFieldHelper>
                {errors.maxSeries && (
                  <Text preset={TEXT_PRESET.caption}>{errors.maxSeries.message}</Text>
                )}
              </FormFieldHelper>
            </FormField>
          )}
        />
      </div>
    </>
  );
};
