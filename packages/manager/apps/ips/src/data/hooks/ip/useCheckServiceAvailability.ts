import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { OrderContext } from '@/pages/order/order.context';
import { ServiceType } from '@/types';
import {
  getDedicatedServerInfo,
  getOrderableIpInfo,
} from '../../api/dedicated-server';

export enum ErrorKind {
  expired = 'expired',
}

const getServiceAvailabilityQueryKey = (serviceName: string) => [
  'dedicatedServer',
  serviceName,
];

export const useCheckServiceAvailability = () => {
  const [errorKind, setErrorKind] = React.useState(null);
  const {
    selectedService,
    selectedServiceType,
    setSelectedRegion,
    addDisabledService,
  } = React.useContext(OrderContext);

  const {
    isLoading: isDedicatedServerServiceInfoLoading,
    data: dedicatedServerData,
    isError: hasDedicatedServerDataError,
    error: dedicatedServerError,
  } = useQuery({
    queryKey: getServiceAvailabilityQueryKey(selectedService),
    queryFn: async () => {
      try {
        const serverInfo = await getDedicatedServerInfo(selectedService);
        // Check if we can order an IP on this service
        await getOrderableIpInfo(selectedService);
        setSelectedRegion(serverInfo?.data?.region);
        setErrorKind(null);
        return serverInfo;
      } catch (err) {
        addDisabledService(selectedService);
        if ((err as ApiError)?.response?.status === 460) {
          // Expired service
          setErrorKind(ErrorKind.expired);
        }
        throw err;
      }
    },
    enabled: !!selectedService && selectedServiceType === ServiceType.server,
    retry: false,
  });

  React.useEffect(() => {
    if (
      selectedService &&
      dedicatedServerData?.data?.region &&
      selectedServiceType === ServiceType.server
    ) {
      setSelectedRegion(dedicatedServerData?.data?.region);
    }
  }, [selectedService, selectedServiceType, dedicatedServerData?.data?.region]);

  return {
    isServiceInfoLoading: isDedicatedServerServiceInfoLoading,
    serviceInfo: dedicatedServerData?.data,
    hasServiceInfoError: hasDedicatedServerDataError,
    serviceInfoError: dedicatedServerError,
    errorKind,
  };
};
