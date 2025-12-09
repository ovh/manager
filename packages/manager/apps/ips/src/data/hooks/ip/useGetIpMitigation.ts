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
import { INVALIDATED_REFRESH_PERIOD, ipFormatter } from '@/utils';

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
    queryFn: async () => {
      try {
        return await getIpMitigation({ ip });
      } catch (apiError) {
        const err = apiError as ApiError;
        if (err.response?.status === 404) {
          return {
            status: 200,
            totalCount: 0,
            data: [],
          };
        }
        throw error;
      }
    },
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
        ? INVALIDATED_REFRESH_PERIOD
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
