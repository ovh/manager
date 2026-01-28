import { useQuery } from '@tanstack/react-query';
import { AxiosHeaders } from 'axios';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { GetIpListParams, getIpList, getIpListQueryKey } from '@/data/api';

export const useGetIpList = (params: GetIpListParams) => {
  const query = useQuery<ApiResponse<string[]>, ApiError>({
    queryKey: getIpListQueryKey(params),
    queryFn: async () => {
      let result: ApiResponse<string[]>;
      try {
        result = await getIpList({ ...params, ip: undefined });
      } catch (err) {
        const error = err as ApiError;
        if (error.response?.data.message.includes('invalid filter')) {
          result = {
            data: [],
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { headers: {} as AxiosHeaders },
          };
        } else {
          throw error;
        }
      }
      return result;
    },
    retry: false,
  });

  return { ipList: query?.data?.data, ...query };
};
