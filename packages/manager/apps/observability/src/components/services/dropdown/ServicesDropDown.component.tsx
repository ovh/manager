import { useTranslation } from 'react-i18next';

import { SelectField } from '@/components/form/select-field/SelectField.component';
import { ServicesDropDownProps } from '@/components/services/dropdown/ServicesDropDown.props';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { ObservabilityService } from '@/types/observability.type';

export default function ServicesDropDown({ onChange }: ServicesDropDownProps) {
  const { t } = useTranslation('metrics');
  const { setSelectedService, selectedService, services, isLoading, isSuccess } =
    useObservabilityServiceContext();

  if (isSuccess && services?.length === 0) {
    return null;
  }

  return (
    <SelectField
      className="max-w-xs"
      label={t('listing.service')}
      value={selectedService?.id}
      name="select-observability-service"
      placeholder={t('listing.select_observability_service')}
      isLoading={isLoading}
      onChange={(value) => {
        setSelectedService(services?.find((service) => service.id === value) ?? undefined);
        onChange?.();
      }}
      options={services?.map(({ id, currentState: { displayName } }: ObservabilityService) => ({
        value: id,
        label: displayName ?? id,
      }))}
    />
  );
}
