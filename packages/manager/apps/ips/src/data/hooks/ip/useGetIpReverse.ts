import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  ApiError,
  ApiResponse,
  IcebergFetchResultV6,
} from '@ovh-ux/manager-core-api';

import {
  IpReverseType,
  getIcebergIpReverse,
  getIcebergIpReverseQueryKey,
  getIpReverse,
  getIpReverseQueryKey,
} from '@/data/api';
import { ipFormatter, isValidIpv6Block } from '@/utils';
import { useGetIpDetailsList } from './useGetIpDetails';

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
  ipReverse?: string;
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
          return {
            data: { ipReverse, reverse: '' },
          } as ApiResponse<IpReverseType>;
        }
        throw err;
      }
    },
    enabled,
    retry: false,
  });
};

export const useIcebergGetIpReverseList = ({
  ipList,
  isEnabled,
}: {
  ipList: string[];
  isEnabled?: (ip?: string) => boolean;
}): {
  isLoading: boolean;
  isError: boolean;
  reverseListByIp: { [ip: string]: IpReverseType[] };
} => {
  const { detailsByIp, isLoading, isError } = useGetIpDetailsList({ ipList });
  const queryClient = useQueryClient();

  const queries = (ipList || []).map((ip) => ({
    queryKey: ['reverseList', encodeURIComponent(ip)],
    queryFn: async () => {
      const result = await getIcebergIpReverse({ ip });
      queryClient.setQueryData(getIcebergIpReverseQueryKey({ ip }), result);

      return {
        ...result,
        data: { ip, reverseList: result.data },
      };
    },
    enabled:
      !isLoading &&
      !isError &&
      !detailsByIp?.[ip]?.bringYourOwnIp &&
      isValidIpv6Block(ip) &&
      (isEnabled ? isEnabled(ip) : true),
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  }));

  const results = useQueries({ queries });

  return {
    isLoading: isLoading || results.some((result) => result.isLoading),
    isError: isError || results.some((result) => result.isError),
    reverseListByIp: results.reduce((acc, result) => {
      if (result.data) {
        acc[result.data.data.ip] = result.data.data.reverseList;
      }
      return acc;
    }, {} as { [ip: string]: IpReverseType[] }),
  };
};
