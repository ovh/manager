import { useQuery } from '@tanstack/react-query';

import { ApiResponse } from '@ovh-ux/manager-core-api';

import { getMeModel, getMeModelQueryKey, MeModelResponse } from '@/data/api';

export const useGetMeModels = () => {
  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<MeModelResponse>>({
    queryKey: getMeModelQueryKey(),
    queryFn: getMeModel,
  });

  return {
    models: result?.data?.models,
    isLoading,
    isError,
    error,
  };
};
