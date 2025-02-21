import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import {
  DedicatedCloudLocation,
  DedicatedServer,
  VPS,
  getDedicatedCloudServiceData,
  getDedicatedCloudServiceLocation,
  getDedicatedServerData,
  getVpsData,
} from '../api';
import { ServiceStatus, ServiceType } from '@/types';
import { DATACENTER_TO_REGION } from './catalog';

export const useServiceRegion = ({
  serviceName,
  serviceType,
  serviceStatus,
}: {
  serviceName?: string;
  serviceType?: ServiceType;
  serviceStatus?: ServiceStatus;
}) => {
  const dedicatedServerData = useQuery<ApiResponse<DedicatedServer>, ApiError>({
    queryKey: [ServiceType.server, serviceName],
    queryFn: async () => getDedicatedServerData(serviceName),
    enabled:
      !!serviceName &&
      serviceStatus === 'ok' &&
      serviceType === ServiceType.server,
    retry: false,
  });

  const vpsData = useQuery<ApiResponse<VPS>, ApiError>({
    queryKey: [ServiceType.vps, serviceName],
    queryFn: async () => getVpsData(serviceName),
    enabled:
      !!serviceName &&
      serviceStatus === 'ok' &&
      serviceType === ServiceType.vps,
    retry: false,
  });

  const dedicatedCloudLocation = useQuery<
    ApiResponse<DedicatedCloudLocation>,
    ApiError
  >({
    queryKey: [ServiceType.dedicatedCloud, serviceName],
    queryFn: async () => {
      const response = await getDedicatedCloudServiceData(serviceName);
      const locationResponse = await getDedicatedCloudServiceLocation(
        response?.data?.location,
      );
      return locationResponse;
    },
    enabled:
      !!serviceName &&
      serviceStatus === 'ok' &&
      serviceType === ServiceType.dedicatedCloud,
    retry: false,
  });

  return {
    isLoading:
      dedicatedServerData?.isLoading ||
      vpsData?.isLoading ||
      dedicatedCloudLocation?.isLoading,
    region:
      dedicatedServerData?.data?.data?.region ||
      DATACENTER_TO_REGION[vpsData?.data?.data?.location.datacentre] ||
      dedicatedCloudLocation?.data?.data?.region,
    isError:
      dedicatedServerData.isError ||
      vpsData.isError ||
      dedicatedCloudLocation?.isError,
    error:
      dedicatedServerData?.error ||
      vpsData?.error ||
      dedicatedCloudLocation?.error,
  };
};
