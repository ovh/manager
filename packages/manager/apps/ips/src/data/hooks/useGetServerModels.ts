import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getServerModels,
  getServerModelsQueryKey,
  ServerModelsType,
} from '@/data/api';

export type UseGetServerModelsParams = {
  enabled?: boolean;
};

export const useGetServerModels = ({
  enabled = true,
}: UseGetServerModelsParams) => {
  const { data: dedicatedServerModels, isLoading, isError, error } = useQuery<
    ApiResponse<ServerModelsType>,
    ApiError
  >({
    queryKey: getServerModelsQueryKey(),
    queryFn: () => getServerModels(),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    models: dedicatedServerModels?.data?.models,
    isLoading,
    isError,
    error,
  };
};
