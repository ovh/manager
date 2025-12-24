import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { ServiceType } from '@/types';

import {
  DedicatedCloudLocation,
  DedicatedServer,
  VpsDatacenter,
  getDedicatedCloudServiceLocation,
  getDedicatedServerData,
  getVpsDatacenter,
} from '../api';
import { DATACENTER_TO_REGION } from './catalog';

export const useServiceRegion = ({
  serviceName,
  serviceType,
  serviceStatus,
}: {
  serviceName?: string | null;
  serviceType?: ServiceType;
  serviceStatus?: string;
}) => {
  const dedicatedServerData = useQuery<ApiResponse<DedicatedServer>, ApiError>({
    queryKey: [ServiceType.server, serviceName],
    queryFn: async () => getDedicatedServerData(serviceName as string),
    enabled:
      !!serviceName &&
      serviceStatus === 'ok' &&
      serviceType === ServiceType.server,
    retry: false,
  });

  const vpsDatacenter = useQuery<ApiResponse<VpsDatacenter>, ApiError>({
    queryKey: [ServiceType.vps, serviceName, 'datacenter'],
    queryFn: async () => getVpsDatacenter(serviceName as string),
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
    queryFn: async () =>
      getDedicatedCloudServiceLocation(serviceName as string),
    enabled:
      !!serviceName &&
      serviceStatus === 'ok' &&
      serviceType === ServiceType.dedicatedCloud,
    retry: false,
  });

  return {
    isLoading:
      dedicatedServerData?.isLoading ||
      vpsDatacenter?.isLoading ||
      dedicatedCloudLocation?.isLoading,
    region:
      dedicatedServerData?.data?.data?.region ||
      dedicatedCloudLocation?.data?.data?.region ||
      DATACENTER_TO_REGION[vpsDatacenter?.data?.data?.name as string] ||
      vpsDatacenter?.data?.data?.name?.toLowerCase(),
    isError:
      dedicatedServerData.isError ||
      vpsDatacenter.isError ||
      dedicatedCloudLocation?.isError,
    error:
      dedicatedServerData?.error ||
      vpsDatacenter?.error ||
      dedicatedCloudLocation?.error,
  };
};
