import React from 'react';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import {
  DedicatedServer,
  getDedicatedServerData,
} from '@/data/api/dedicated-server';
import { OrderContext, ServiceStatus } from '@/pages/order/order.context';
import { ServiceType } from '@/types';

export const useServiceRegion = () => {
  const {
    selectedServiceType,
    selectedService,
    selectedServiceStatus,
  } = React.useContext(OrderContext);

  const dedicatedServerData = useQuery<ApiResponse<DedicatedServer>, ApiError>({
    queryKey: [ServiceType.server, selectedService],
    queryFn: () => getDedicatedServerData(selectedService),
    enabled:
      !!selectedService &&
      selectedServiceStatus === ServiceStatus.ok &&
      selectedServiceType === ServiceType.server,
    retry: false,
  });

  return {
    isServiceRegionLoading: dedicatedServerData.isLoading,
    serviceRegionError: dedicatedServerData.error,
    serviceRegion: dedicatedServerData?.data?.data?.region,
  };
};
