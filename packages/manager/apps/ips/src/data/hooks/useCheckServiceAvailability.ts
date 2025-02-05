import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { OrderContext, ServiceStatus } from '@/pages/order/order.context';
import { ServiceType } from '@/types';
import { getDedicatedServerServiceInfos } from '@/data/api/dedicated-server';
import { getVrackServiceInfos } from '@/data/api/vrack';

export const useCheckServiceAvailability = () => {
  const {
    selectedService,
    selectedServiceType,
    setSelectedServiceStatus,
    addDisabledService,
  } = React.useContext(OrderContext);

  const { isLoading, data, isError, error } = useQuery({
    queryKey: [selectedServiceType, selectedService, 'serviceInfos'],
    queryFn: async () => {
      try {
        if (selectedServiceType === ServiceType.server) {
          const serviceInfos = await getDedicatedServerServiceInfos(
            selectedService,
          );
          if (serviceInfos.data.status === 'expired') {
            setSelectedServiceStatus(ServiceStatus.expired);
            addDisabledService(selectedService);
          }
          // Check if we can order an IP on this service
          // await getOrderableIpInfo(selectedService);
          return serviceInfos;
        }
        if (selectedServiceType === ServiceType.vrack) {
          const serviceInfos = await getVrackServiceInfos(selectedService);
          if (serviceInfos.data.status === 'expired') {
            setSelectedServiceStatus(ServiceStatus.expired);
            addDisabledService(selectedService);
          }
          return serviceInfos;
        }
        return null;
      } catch (err) {
        addDisabledService(selectedService);
        if ((err as ApiError)?.response?.status === 460) {
          // Expired service
          setSelectedServiceStatus(ServiceStatus.expired);
        }
        throw err;
      }
    },
    enabled:
      !!selectedService &&
      [ServiceType.server, ServiceType.vrack].includes(selectedServiceType),
    retry: false,
  });

  return {
    isServiceInfoLoading: isLoading,
    serviceInfo: data?.data,
    hasServiceInfoError: isError,
    serviceInfoError: error,
  };
};
