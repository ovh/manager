import { useQuery } from '@tanstack/react-query';
import { getMeModelQueryKey, getMeModel } from '@/data/api';

interface MeModelResponse {
  data: {
    models: any;
  };
}

export const useGetMeModels = () => {
  const { data: result, isLoading, isError, error } = useQuery<MeModelResponse>(
    {
      queryKey: getMeModelQueryKey(),
      queryFn: getMeModel,
    },
  );

  return {
    models: result?.data?.models,
    isLoading,
    isError,
    error,
  };
};
