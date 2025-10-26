import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsSelect, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { ObservabilityService } from '@/types/observability.type';

export default function ServicesDropDown() {
  const { t } = useTranslation('metrics');
  const { setSelectedService, selectedService, services, isLoading, isSuccess } =
    useObservabilityServiceContext();

  if (isSuccess && services?.length === 0) {
    return null;
  }

  return (
    <OdsFormField className="my-4 w-full">
      {isLoading ? (
        <OdsSkeleton className="max-w-[15rem]" />
      ) : (
        <>
          <OdsText preset={ODS_TEXT_PRESET.paragraph} slot="label">
            {t('listing.service')}
          </OdsText>
          <OdsSelect
            className="max-w-[15rem]"
            value={selectedService}
            name="select-observability-service"
            placeholder={t('listing.select_observability_service')}
            onOdsChange={(v) => {
              const value = v.detail.value?.toString();
              setSelectedService(value);
            }}
          >
            {services?.map(({ id, currentState: { displayName } }: ObservabilityService) => (
              <option key={id} value={id}>
                {displayName ?? id}
              </option>
            ))}
          </OdsSelect>
        </>
      )}
    </OdsFormField>
  );
}
