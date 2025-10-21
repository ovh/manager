import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { SelectField } from '@/components/form/select-field/SelectField.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useInfrastructures } from '@/data/hooks/infrastructures/useInfrastructures.hook';
import { TenantFormData } from '@/types/tenants.type';

export default function RegionSelector() {
  const { t } = useTranslation('infrastructure');
  const {
    control,
    formState: { errors },
  } = useFormContext<TenantFormData>();
  const { selectedService } = useObservabilityServiceContext();

  const { data: infrastructures, isLoading } = useInfrastructures({
    resourceName: selectedService?.id || '',
    usages: 'METRICS',
    types: 'SHARED',
  });

  if (isLoading) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.sm} />;
  }

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading4}>{t('infrastructure.region.title')}</OdsText>
      <OdsFormField className="block">
        <Controller
          name="infrastructureId"
          control={control}
          render={({ field }) => (
            <SelectField
              className="w-1/2"
              value={field.value}
              name="select-infrastructure"
              placeholder="Select Infrastructure"
              onOdsChange={(v: { detail: { value?: string | null } }) => {
                const value = v.detail.value ?? '';
                field.onChange(value);
              }}
              error={errors.infrastructureId?.message}
            >
              {infrastructures?.map(({ id, locationDetails }) => (
                <option key={id} value={id}>
                  {`${locationDetails?.location} • ${locationDetails?.type}`}
                </option>
              ))}
            </SelectField>
          )}
        />
      </OdsFormField>
    </>
  );
}
