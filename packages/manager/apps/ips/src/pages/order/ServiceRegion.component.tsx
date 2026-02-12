import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  MessageBody,
  SPINNER_SIZE,
  Message,
  Spinner,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useCheckServiceAvailability } from '@/data/hooks/useCheckServiceAvailability';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';
import { OrderContext } from '@/pages/order/order.context';
import { ServiceType } from '@/types';
import { TRANSLATION_NAMESPACES } from '@/utils';

export const ServiceRegion = () => {
  const {
    selectedServiceType,
    selectedService,
    addDisabledService,
  } = React.useContext(OrderContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.order,
    NAMESPACES.REGION,
  ]);
  const { serviceStatus, isServiceInfoLoading } = useCheckServiceAvailability({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    onServiceUnavailable: addDisabledService,
  });
  const { loading, region, isError, error } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    serviceStatus,
  });

  if (isServiceInfoLoading || loading) {
    return <Spinner size={SPINNER_SIZE.sm} />;
  }

  if (isError) {
    return (
      <Message
        className="block max-w-[384px]"
        color={MESSAGE_COLOR.critical}
        dismissible={false}
      >
        <MessageBody>
          {t('error_message', {
            error: error?.response?.data?.message,
          })}
        </MessageBody>
      </Message>
    );
  }

  if (
    !region ||
    !selectedServiceType ||
    ![ServiceType.vps, ServiceType.server, ServiceType.dedicatedCloud].includes(
      selectedServiceType,
    )
  ) {
    return <></>;
  }

  return (
    <>
      {t('service_selection_region_helper')}
      {t(`region_${region}`, { ns: NAMESPACES.REGION })}
    </>
  );
};
