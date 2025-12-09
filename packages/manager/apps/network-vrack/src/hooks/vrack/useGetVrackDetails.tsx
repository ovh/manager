import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { Vrack, getVrackDetail, getVrackDetailQueryKey } from '@/data/api/get/vrack-details';

export const useGetVrackDetails = (serviceName: string) => {
  const { data, isLoading, isError, error } = useQuery<Vrack, ApiError>({
    queryKey: getVrackDetailQueryKey(serviceName),
    queryFn: () => getVrackDetail(serviceName),
    retry: false,
  });

  return { data, isLoading, isError, error };
};
