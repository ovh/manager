import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getServices } from '@/data/api/services';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { ProductList } from '@/types/services.type';

export const useFetchHubServices = () =>
  useQuery<ApiEnvelope<ProductList>, AxiosError>({
    queryKey: ['getHubServices'],
    queryFn: getServices,
    retry: 0,
  });
