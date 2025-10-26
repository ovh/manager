import { useTranslation } from 'react-i18next';

import { SelectField } from '@/components/form/select-field/SelectField.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { ObservabilityService } from '@/types/observability.type';

import { ServicesDropDownProps } from './ServicesDropDown.props';

export default function ServicesDropDown({ onChange }: ServicesDropDownProps) {
  const { t } = useTranslation('metrics');
  const { setSelectedService, selectedService, services, isLoading, isSuccess } =
    useObservabilityServiceContext();

  if (isSuccess && services?.length === 0) {
    return null;
  }

  return (
    <SelectField
      className="max-w-[20rem]"
      label={t('listing.service')}
      value={selectedService?.id}
      name="select-observability-service"
      placeholder={t('listing.select_observability_service')}
      isLoading={isLoading}
      onOdsChange={(v: { detail: { value?: string | null } }) => {
        const value = v.detail.value?.toString();
        setSelectedService(services?.find((service) => service.id === value) ?? undefined);
        onChange?.();
      }}
    >
      {services?.map(({ id, currentState: { displayName } }: ObservabilityService) => (
        <option key={id} value={id}>
          {displayName ?? id}
        </option>
      ))}
    </SelectField>
  );
}
