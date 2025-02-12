import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { OrderContext, ServiceStatus } from '@/pages/order/order.context';
import { ServiceType } from '@/types';
import {
  DedicatedServerServiceInfos,
  getDedicatedServerServiceInfos,
} from '@/data/api/dedicated-server';
import { VrackServiceInfos, getVrackServiceInfos } from '@/data/api/vrack';
import { VpsServiceInfos, getVpsServiceInfos } from '../api/vps';

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
        let serviceInfos: ApiResponse<
          DedicatedServerServiceInfos | VpsServiceInfos | VrackServiceInfos
        > = null;
        switch (selectedServiceType) {
          case ServiceType.server:
            serviceInfos = await getDedicatedServerServiceInfos(
              selectedService,
            );
            break;
          case ServiceType.vps:
            serviceInfos = await getVpsServiceInfos(selectedService);
            break;
          case ServiceType.vrack:
            serviceInfos = await getVrackServiceInfos(selectedService);
            break;
          default:
            serviceInfos = null;
        }
        if (serviceInfos.data.status === 'expired') {
          setSelectedServiceStatus(ServiceStatus.expired);
          addDisabledService(selectedService);
        }
        return serviceInfos;
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
      [ServiceType.server, ServiceType.vrack, ServiceType.vps].includes(
        selectedServiceType,
      ),
    retry: false,
  });

  return {
    isServiceInfoLoading: isLoading,
    serviceInfo: data?.data,
    hasServiceInfoError: isError,
    serviceInfoError: error,
  };
};
