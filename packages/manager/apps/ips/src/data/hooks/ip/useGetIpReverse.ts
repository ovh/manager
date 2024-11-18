import { useQuery } from '@tanstack/react-query';
import {
  ApiError,
  ApiResponse,
  IcebergFetchResultV6,
} from '@ovh-ux/manager-core-api';
import {
  IpReverseType,
  getIcebergIpReverse,
  getIpReverse,
  getIpReverseQueryKey,
  getIcebergIpReverseQueryKey,
} from '@/data/api';
import { ipFormatter } from '@/utils';

export type UseGetIcebergIpReverseParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIcebergIpReverse = ({
  ip,
  enabled = true,
}: UseGetIcebergIpReverseParams) => {
  const { data: ipReverseResponse, ...query } = useQuery<
    IcebergFetchResultV6<IpReverseType>,
    ApiError
  >({
    queryKey: getIcebergIpReverseQueryKey({ ip }),
    queryFn: () => getIcebergIpReverse({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    ipsReverse: ipReverseResponse?.data,
    data: ipReverseResponse,
    ...query,
  };
};

export const useGetIpReverse = ({
  ip,
  ipReverse,
  enabled = true,
}: {
  /**
   * IP block
   */
  ip: string;
  /**
   * Single IP contained in the IP Block "ip"
   */
  ipReverse: string;
  enabled?: boolean;
}) => {
  const { ipGroup } = ipFormatter(ip);
  return useQuery<ApiResponse<IpReverseType>, ApiError>({
    queryKey: getIpReverseQueryKey({ ip: ipGroup, ipReverse }),
    queryFn: async () => {
      try {
        const response = await getIpReverse({ ip: ipGroup, ipReverse });
        return response;
      } catch (err) {
        if ((err as ApiError)?.response?.status === 404) {
          return { data: { ipReverse, reverse: '' } } as ApiResponse<
            IpReverseType
          >;
        }
        throw err;
      }
    },
    enabled,
    retry: false,
  });
};
