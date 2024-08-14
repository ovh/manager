import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getVrackList, getVrackListQueryKey } from '../get';

export const useVrackList = () => {
  const { data: vrackListResponse, isLoading, isError, error } = useQuery<
    ApiResponse<string[]>,
    ApiError
  >({
    queryKey: getVrackListQueryKey,
    queryFn: getVrackList,
  });

  return { vrackList: vrackListResponse?.data, isLoading, isError, error };
};

export default useVrackList;
