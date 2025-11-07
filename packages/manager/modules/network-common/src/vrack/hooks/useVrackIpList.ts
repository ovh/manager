import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getVrackIpList, getVrackIpListQueryKey } from '../api';

export const useVrackIpList = (
  vrackId?: string,
  options?: Omit<
    UseQueryOptions<
      ApiResponse<string[]>,
      ApiError,
      ApiResponse<string[]>,
      QueryKey
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const query = useQuery<ApiResponse<string[]>, ApiError>({
    queryKey: getVrackIpListQueryKey(vrackId || ''),
    queryFn: () => getVrackIpList(vrackId || ''),
    retry: false,
    ...options,
  });

  return {
    ip: query.data?.data ?? [],
    ...query,
  };
};

export default useVrackIpList;
