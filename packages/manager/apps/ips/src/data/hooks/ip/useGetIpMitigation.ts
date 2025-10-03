import { useQuery } from '@tanstack/react-query';
import {
  ApiError,
  ApiResponse,
  IcebergFetchResultV6,
} from '@ovh-ux/manager-core-api';
import {
  IpMitigationType,
  getIpMitigation,
  getIpMitigationQueryKey,
  getIpMitigationWithoutIceberg,
  getIpMitigationWithoutIcebergQueryKey,
} from '@/data/api';
import { ipFormatter } from '@/utils';

export type UseGetIpMitigationParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIpMitigation = ({
  ip,
  enabled = true,
}: UseGetIpMitigationParams) => {
  const { data: ipMitigationResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpMitigationType>,
    ApiError
  >({
    queryKey: getIpMitigationQueryKey({ ip }),
    queryFn: () => getIpMitigation({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    ipMitigation: ipMitigationResponse?.data,
    isLoading,
    isError,
    error,
  };
};

export const useGetIpMitigationWithoutIceberg = ({
  ip,
  enabled = true,
}: UseGetIpMitigationParams) => {
  const { ipGroup, ipAddress } = ipFormatter(ip);
  const ipBlockip = ipGroup;
  const { data: ipMitigationResponse, isLoading, isError, error } = useQuery<
    ApiResponse<IpMitigationType>,
    ApiError
  >({
    queryKey: getIpMitigationWithoutIcebergQueryKey({
      ipBlockip,
      ip: ipAddress,
    }),
    queryFn: async () => {
      try {
        const response = await getIpMitigationWithoutIceberg({
          ipBlockip,
          ip: ipAddress,
        });
        return response;
      } catch (err) {
        if ((err as ApiError)?.response?.status === 404) {
          return { data: {} } as ApiResponse<IpMitigationType>;
        }
        throw err;
      }
    },
    enabled,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.data?.state === 'creationPending' ||
      query.state.data?.data?.state === 'removalPending'
        ? 2000
        : false,
  });

  return {
    ipMitigation: ipMitigationResponse?.data
      ? ipMitigationResponse?.data
      : ({} as IpMitigationType),
    isLoading,
    isError,
    error,
  };
};
