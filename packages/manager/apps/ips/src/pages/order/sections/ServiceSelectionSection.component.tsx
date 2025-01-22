import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import {
  ipParkingOptionValue,
  useServiceList,
} from '@/data/hooks/useServiceList';
import { OrderContext } from '../order.context';

export const ServiceSelectionSection: React.FC = () => {
  const {
    selectedService,
    setSelectedService,
    setSelectedServiceType,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { vrack, getServiceType, isLoading, isError, error } = useServiceList();

  return (
    <OrderSection title={t('service_selection_title')}>
      {isError && (
        <OdsMessage color={ODS_MESSAGE_COLOR.critical}>
          {t('error_message', { error })}
        </OdsMessage>
      )}
      <OdsFormField className="w-full">
        <label htmlFor="service" slot="label">
          {t('service_selection_select_label')}
        </label>
        {isLoading ? (
          <OdsSkeleton />
        ) : (
          <OdsSelect
            className="w-full max-w-[384px]"
            id="service"
            name="service"
            isDisabled={isLoading || isError}
            onOdsChange={(event) => {
              const serviceId = event.target.value as string;
              setSelectedService(serviceId);
              setSelectedServiceType(getServiceType(serviceId));
            }}
            value={selectedService}
            placeholder={t('service_selection_select_placeholder')}
          >
            <optgroup
              label={t(
                'service_selection_select_ip_parking_option_group_label',
              )}
            >
              <option value={ipParkingOptionValue}>
                {t('service_selection_select_ip_parking_option_label')}
              </option>
            </optgroup>
            <optgroup
              label={t('service_selection_select_vrack_option_group_label')}
            >
              {vrack?.map((currentVrack) => (
                <option key={currentVrack} value={currentVrack}>
                  {currentVrack}
                </option>
              ))}
            </optgroup>
          </OdsSelect>
        )}
      </OdsFormField>
    </OrderSection>
  );
};
