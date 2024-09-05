import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getServices } from '@/data/api/services';
import { Services } from '@/types/services.type';
import { ApiEnvelope } from '@/types/apiEnvelope.type';

export const useFetchHubServices = () =>
  useQuery<ApiEnvelope<Services>, AxiosError>({
    queryKey: ['getHubServices'],
    queryFn: getServices,
    retry: 0,
  });
