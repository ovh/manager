import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { GetIpListParams, getIpList, getIpListQueryKey } from '@/data/api';

export const useGetIpList = (params: GetIpListParams) => {
  const { data: ipListResponse, isLoading, isError, error } = useQuery<
    ApiResponse<string[]>,
    ApiError
  >({
    queryKey: getIpListQueryKey(params),
    queryFn: () => getIpList(params),
  });

  return { ipList: ipListResponse?.data, isLoading, isError, error };
};
