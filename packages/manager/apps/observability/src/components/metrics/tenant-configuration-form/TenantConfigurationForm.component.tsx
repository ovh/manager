import React from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  Quantity,
  QuantityControl,
  QuantityInput,
} from '@ovhcloud/ods-react';

import { TEXT_PRESET, Text } from '@ovh-ux/muk';

import { SelectField } from '@/components/form/select-field/SelectField.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useRetentions } from '@/data/hooks/infrastructures/useRetentions.hook';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import type { TenantFormData } from '@/types/tenants.type';
import { formatDuration } from '@/utils/duration.utils';
import { toRequiredLabel } from '@/utils/form.utils';
import { INGESTION_BOUNDS } from '@/utils/tenants.constants';

export const TenantConfigurationForm = () => {
  const { t } = useTranslation(['tenants', 'shared']);
  const {
    control,
    formState: { errors },
  } = useFormContext<TenantFormData>();

  const { selectedService } = useObservabilityServiceContext();
  const dateFnsLocale = useDateFnsLocale();

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
      <Text preset={TEXT_PRESET.heading2}>{t('configuration.title')}</Text>
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
              label={toRequiredLabel(t('tenants:configuration.retention'), t('shared:mandatory'))}
              placeholder={t('tenants:configuration.retentionPlaceholder')}
              onChange={(value) => field.onChange(value ?? '')}
              options={retentions?.map((option) => ({
                value: option.id,
                label: formatDuration(option.duration, dateFnsLocale),
              }))}
              error={errors.retentionId?.message}
            />
          )}
        />

        <Controller
          name="maxSeries"
          control={control}
          render={({ field }) => (
            <FormField className="block">
              <FormFieldLabel>
                <Text preset={TEXT_PRESET.paragraph}>{t('tenants:configuration.limit.title')}</Text>
              </FormFieldLabel>
              <Quantity
                name="limit-quantity"
                min={INGESTION_BOUNDS.MIN}
                max={INGESTION_BOUNDS.MAX}
                value={field.value?.toString() || ''}
                onValueChange={(detail) =>
                  field.onChange(detail.value ? parseInt(detail.value, 10) : null)
                }
                invalid={!!errors.maxSeries}
                disabled={!infrastructureId}
              >
                <QuantityControl>
                  <QuantityInput className="w-24" />
                </QuantityControl>
              </Quantity>
              <FormFieldHelper>
                <Text preset={TEXT_PRESET.caption}>
                  {t('tenants:configuration.limit.description')}
                </Text>
                {errors.maxSeries && (
                  <div>
                    <Text preset={TEXT_PRESET.caption}>{errors.maxSeries.message}</Text>
                  </div>
                )}
              </FormFieldHelper>
            </FormField>
          )}
        />
      </div>
    </>
  );
};
