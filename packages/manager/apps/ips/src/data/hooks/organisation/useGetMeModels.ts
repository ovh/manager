import { useQuery } from '@tanstack/react-query';

import { ApiResponse } from '@ovh-ux/manager-core-api';

import { getMeModel, getMeModelQueryKey } from '@/data/api';

interface MeModelResponse {
  models: {
    'nichandle.IpRegistryEnum': {
      enum: string[];
    };
    'nichandle.CountryEnum': {
      enum: string[];
    };
  };
}

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
