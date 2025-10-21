import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsQuantity, OdsText } from '@ovhcloud/ods-components/react';

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

  const { data: retentions, isPending } = useRetentions({
    resourceName: selectedService?.id || '',
    infrastructureId: infrastructureId || '',
  });

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading4}>{t('configuration.title')}</OdsText>
      <div className="grid grid-cols-1 gap-4">
        <Controller
          name="retentionId"
          control={control}
          render={({ field }) => (
            <OdsFormField className="block">
              <SelectField
                isDisabled={!infrastructureId || isPending}
                className="w-1/2"
                value={field.value}
                name="select-retention"
                label={toRequiredLabel(t('configuration.retention'))}
                placeholder={t('configuration.retentionPlaceholder')}
                onOdsChange={(v: { detail: { value?: string | null } }) => {
                  const value = v.detail.value ?? '';
                  field.onChange(value);
                }}
                error={errors.retentionId?.message}
              >
                {retentions?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {formatDuration(option.duration, dateFnsLocale)}
                  </option>
                ))}
              </SelectField>
            </OdsFormField>
          )}
        />

        <OdsText preset={ODS_TEXT_PRESET.heading6}>{t('configuration.limit.title')}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('configuration.limit.description')}</OdsText>

        <Controller
          name="maxSeries"
          control={control}
          render={({ field }) => (
            <OdsFormField className="block">
              <OdsQuantity
                name="limit-quantity"
                min={INGESTION_BOUNDS.MIN}
                max={INGESTION_BOUNDS.MAX}
                value={field.value}
                onOdsChange={(e) => field.onChange(e.detail.value as number)}
                hasError={!!errors.maxSeries}
              />
              {errors.maxSeries && (
                <OdsText preset={ODS_TEXT_PRESET.caption} slot="helper">
                  {errors.maxSeries.message}
                </OdsText>
              )}
            </OdsFormField>
          )}
        />
      </div>
    </>
  );
};
