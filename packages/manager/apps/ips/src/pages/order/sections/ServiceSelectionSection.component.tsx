import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsSkeleton,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Region } from '@ovh-ux/manager-react-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import {
  ipParkingOptionValue,
  useServiceList,
} from '@/data/hooks/useServiceList';
import { OrderContext, ServiceStatus } from '../order.context';
import { ServiceType } from '@/types';
import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';

export const ServiceSelectionSection: React.FC = () => {
  const {
    selectedService,
    selectedServiceStatus,
    selectedServiceType,
    setSelectedService,
    setSelectedRegion,
    setSelectedServiceType,
    disabledServices,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const {
    server,
    vrack,
    getServiceType,
    isLoading,
    isError,
    error,
  } = useServiceList();
  const { isServiceInfoLoading } = useCheckServiceAvailability();
  const {
    isServiceRegionLoading,
    serviceRegion,
    serviceRegionError,
  } = useServiceRegion();

  React.useEffect(() => {
    setSelectedRegion(serviceRegion);
  }, [serviceRegion]);

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
                'service_selection_select_dedicated_cloud_option_group_label',
              )}
            ></optgroup>
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
            ></optgroup>
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
        <div slot="helper">
          <div className="mt-1">
            {isServiceInfoLoading ||
              (isServiceRegionLoading && (
                <OdsSpinner size={ODS_SPINNER_SIZE.sm} />
              ))}
            {selectedServiceStatus !== ServiceStatus.ok && (
              <OdsMessage
                className="block max-w-[384px]"
                color={ODS_MESSAGE_COLOR.danger}
                isDismissible={false}
              >
                {t(
                  `service_selection_dedicated_server_${selectedServiceStatus}_error_message`,
                )}
              </OdsMessage>
            )}
            {[ServiceType.server].includes(selectedServiceType) &&
              serviceRegion &&
              selectedServiceStatus === ServiceStatus.ok &&
              !serviceRegionError && (
                <>
                  {t('service_selection_region_helper')}
                  {serviceRegion === 'unknown' ? (
                    t('service_selection_unknown_region')
                  ) : (
                    <Region name={serviceRegion} mode="region" />
                  )}
                </>
              )}
          </div>
        </div>
      </OdsFormField>
    </OrderSection>
  );
};
