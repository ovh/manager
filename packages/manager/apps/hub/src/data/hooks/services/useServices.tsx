import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getServices } from '@/data/api/services';
import { Services } from '@/types/services.type';

export const useFetchHubServices = () =>
  useQuery<Services, AxiosError>({
    queryKey: ['getHubServices'],
    queryFn: getServices,
    retry: 0,
  });
