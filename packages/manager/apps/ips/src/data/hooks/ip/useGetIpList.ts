import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getIpList, getIpListQueryKey } from '@/data/api';

export const useGetIpList = () => {
  const { data: ipListResponse, isLoading, isError, error } = useQuery<
    ApiResponse<string[]>,
    ApiError
  >({
    queryKey: getIpListQueryKey({}),
    queryFn: () => getIpList({}),
  });

  return { ipList: ipListResponse?.data, isLoading, isError, error };
};
