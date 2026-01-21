import { useTranslation } from 'react-i18next';

import { SelectField } from '@/components/form/select-field/SelectField.component';
import { ServicesDropDownProps } from '@/components/services/ServicesDropDown.props';
import { ObservabilityService } from '@/types/observability.type';

export default function ServicesDropDown({ 
  services, 
  selectedServiceId, 
  isLoading, 
  onChange 
}: ServicesDropDownProps) {
  const { t } = useTranslation('metrics');

  const isSuccess = services !== undefined;
  if (isSuccess && services?.length === 0) {
    return null;
  }

  return (
    <SelectField      
      label={t('listing.service')}
      value={selectedServiceId}
      name="select-observability-service"
      placeholder={t('listing.select_observability_service')}
      isLoading={isLoading}
      onChange={(value) => {
        onChange?.(value);
      }}
      options={services?.map(({ id, currentState: { displayName } }: ObservabilityService) => ({
        value: id,
        label: displayName ?? id,
      }))}
    />
  );
}
