import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { Vrack, getVrackDetail, getVrackDetailQueryKey } from '@/data/api/get/vrackDetails';

export const useGetVrackDetails = (serviceName: string = '') => {
  const { data, isLoading, isError } = useQuery<Vrack, ApiError>({
    queryKey: getVrackDetailQueryKey(serviceName),
    queryFn: () => getVrackDetail(serviceName),
    retry: false,
    enabled: serviceName !== '',
  });

  return { data, isLoading, isError };
};
