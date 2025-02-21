import React from 'react';
import { Region } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsSpinner, OdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OrderContext } from '@/pages/order/order.context';
import { ServiceType } from '@/types';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';
import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';

export const ServiceRegion = () => {
  const {
    selectedServiceType,
    selectedService,
    addDisabledService,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { serviceStatus, isServiceInfoLoading } = useCheckServiceAvailability({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    onServiceExpired: addDisabledService,
  });
  const { isLoading, region, isError, error } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    serviceStatus,
  });

  if (isServiceInfoLoading || isLoading) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.sm} />;
  }

  if (isError) {
    return (
      <OdsMessage
        className="block max-w-[384px]"
        color={ODS_MESSAGE_COLOR.danger}
        isDismissible={false}
      >
        {t('error_message', {
          error: error?.response?.data?.message,
        })}
      </OdsMessage>
    );
  }

  if (
    !region ||
    ![ServiceType.vps, ServiceType.server, ServiceType.dedicatedCloud].includes(
      selectedServiceType,
    )
  ) {
    return <></>;
  }

  return (
    <>
      {t('service_selection_region_helper')}
      {region === 'unknown' ? (
        t('service_selection_unknown_region')
      ) : (
        <Region name={region} mode="region" />
      )}
    </>
  );
};
