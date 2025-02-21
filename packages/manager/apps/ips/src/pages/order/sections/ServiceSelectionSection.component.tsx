import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import {
  ipParkingOptionValue,
  useServiceList,
} from '@/data/hooks/useServiceList';
import { OrderContext } from '../order.context';
import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';
import { ServiceRegion } from '@/pages/order/ServiceRegion.component';

export const ServiceSelectionSection: React.FC = () => {
  const {
    selectedService,
    setSelectedService,
    selectedServiceType,
    setSelectedServiceType,
    disabledServices,
    addDisabledService,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const {
    server,
    vrack,
    vps,
    dedicatedCloud,
    getServiceType,
    isLoading,
    isError,
    error,
  } = useServiceList();
  const {
    isServiceInfoLoading,
    hasServiceInfoError,
    serviceStatus,
  } = useCheckServiceAvailability({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    onServiceExpired: addDisabledService,
  });

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
          <OdsSpinner size={ODS_SPINNER_SIZE.md} />
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
                'service_selection_select_dedicated_cloud_option_group_label',
              )}
            >
              {dedicatedCloud?.map(({ serviceName, displayName }) => (
                <option
                  key={serviceName}
                  value={serviceName}
                  disabled={disabledServices.includes(serviceName)}
                >
                  {displayName}
                </option>
              ))}
            </optgroup>
            <optgroup
              label={t(
                'service_selection_select_dedicated_server_option_group_label',
              )}
            >
              {server?.map(({ serviceName, displayName }) => (
                <option
                  key={serviceName}
                  value={serviceName}
                  disabled={disabledServices.includes(serviceName)}
                >
                  {displayName}
                </option>
              ))}
            </optgroup>
            <optgroup
              label={t('service_selection_select_vps_option_group_label')}
            >
              {vps.map(({ serviceName, displayName }) => (
                <option
                  key={serviceName}
                  value={serviceName}
                  disabled={disabledServices.includes(serviceName)}
                >
                  {displayName}
                </option>
              ))}
            </optgroup>
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
                <option
                  key={currentVrack}
                  value={currentVrack}
                  disabled={disabledServices.includes(currentVrack)}
                >
                  {currentVrack}
                </option>
              ))}
            </optgroup>
          </OdsSelect>
        )}
        {!!selectedService && (
          <div slot="helper">
            <div className="mt-1">
              {!isServiceInfoLoading &&
                (serviceStatus !== 'ok' || hasServiceInfoError) && (
                  <OdsMessage
                    className="block max-w-[384px]"
                    color={ODS_MESSAGE_COLOR.danger}
                    isDismissible={false}
                  >
                    {t(
                      `service_selection_dedicated_server_${serviceStatus ||
                        'expired'}_error_message`,
                    )}
                  </OdsMessage>
                )}
              <ServiceRegion />
            </div>
          </div>
        )}
      </OdsFormField>
    </OrderSection>
  );
};
