import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { ServiceType } from '@/types';

import {
  DedicatedCloudServiceInfos,
  DedicatedServerServiceInfos,
  OrderableIpResponse,
  VpsServiceInfos,
  VrackServiceInfos,
  getDedicatedCloudServiceInfos,
  getDedicatedServerOrderableIp,
  getDedicatedServerServiceInfos,
  getVpsServiceInfos,
  getVrackServiceInfos,
} from '../api';

export const useCheckServiceAvailability = ({
  serviceName,
  serviceType,
  onServiceUnavailable,
}: {
  serviceName?: string | null;
  serviceType?: ServiceType;
  onServiceUnavailable?: (serviceName?: string | null) => void;
}) => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: [serviceType, serviceName, 'availability'],
    queryFn: async () => {
      try {
        let serviceInfos: ApiResponse<
          | DedicatedServerServiceInfos
          | VpsServiceInfos
          | VrackServiceInfos
          | DedicatedCloudServiceInfos
        > | null = null;
        let orderableIps: ApiResponse<OrderableIpResponse> | null = null;
        switch (serviceType) {
          case ServiceType.server:
            serviceInfos = await getDedicatedServerServiceInfos(serviceName);
            orderableIps = await getDedicatedServerOrderableIp(serviceName);
            if (orderableIps?.data?.ipv4.length === 0) {
              return {
                data: {
                  status: 'ip_quota_exceeded',
                },
              };
            }
            break;
          case ServiceType.vps:
            serviceInfos = await getVpsServiceInfos(serviceName);
            break;
          case ServiceType.vrack:
            serviceInfos = await getVrackServiceInfos(serviceName);
            break;
          case ServiceType.dedicatedCloud:
            serviceInfos = await getDedicatedCloudServiceInfos(serviceName);
            break;
          default:
            serviceInfos = null;
        }
        if (!!serviceName && serviceInfos?.data?.status === 'expired') {
          onServiceUnavailable?.(serviceName);
        }
        return serviceInfos;
      } catch (err) {
        if ((err as ApiError)?.response?.status === 460 && !!serviceName) {
          onServiceUnavailable?.(serviceName);
        }
        throw err;
      }
    },
    enabled:
      !!serviceName &&
      !!serviceType &&
      [
        ServiceType.server,
        ServiceType.vrack,
        ServiceType.vps,
        ServiceType.dedicatedCloud,
      ].includes(serviceType),
    retry: false,
  });

  return {
    isServiceInfoLoading: isLoading,
    serviceStatus:
      serviceType === ServiceType.ipParking ? 'ok' : data?.data?.status,
    hasServiceInfoError: isError,
    serviceInfoError: error,
  };
};
