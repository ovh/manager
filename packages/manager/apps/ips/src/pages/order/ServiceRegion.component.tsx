import React from 'react';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { Region } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsSpinner, OdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  DedicatedServer,
  getDedicatedServerData,
} from '@/data/api/dedicated-server';
import { OrderContext, ServiceStatus } from '@/pages/order/order.context';
import { ServiceType } from '@/types';
import { VPS, getVpsData } from '@/data/api/vps';
import { DATACENTER_TO_REGION } from '@/data/hooks/catalog';

export const ServiceRegion = () => {
  const {
    selectedServiceType,
    selectedService,
    selectedServiceStatus,
    setSelectedRegion,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');

  const dedicatedServerData = useQuery<ApiResponse<DedicatedServer>, ApiError>({
    queryKey: [ServiceType.server, selectedService],
    queryFn: async () => {
      const response = await getDedicatedServerData(selectedService);
      setSelectedRegion(response?.data?.region);
      return response;
    },
    enabled:
      !!selectedService &&
      selectedServiceStatus === ServiceStatus.ok &&
      selectedServiceType === ServiceType.server,
    retry: false,
  });

  const vpsData = useQuery<ApiResponse<VPS>, ApiError>({
    queryKey: [ServiceType.vps, selectedService],
    queryFn: async () => {
      const response = await getVpsData(selectedService);
      setSelectedRegion(
        DATACENTER_TO_REGION[response?.data?.location.datacentre],
      );
      return response;
    },
    enabled:
      !!selectedService &&
      selectedServiceStatus === ServiceStatus.ok &&
      selectedServiceType === ServiceType.vps,
    retry: false,
  });

  if (
    !selectedService ||
    selectedServiceStatus !== ServiceStatus.ok ||
    ![ServiceType.vps, ServiceType.server].includes(selectedServiceType)
  ) {
    return <></>;
  }

  if (dedicatedServerData?.isLoading || vpsData?.isLoading) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.sm} />;
  }

  if (dedicatedServerData.error || vpsData.error) {
    return (
      <OdsMessage
        className="block max-w-[384px]"
        color={ODS_MESSAGE_COLOR.danger}
        isDismissible={false}
      >
        {t('error_message', {
          error:
            dedicatedServerData?.error?.response?.data?.message ||
            vpsData?.error?.response?.data?.message,
        })}
      </OdsMessage>
    );
  }

  const region =
    dedicatedServerData?.data?.data?.region ||
    DATACENTER_TO_REGION[vpsData?.data?.data?.location.datacentre];

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
