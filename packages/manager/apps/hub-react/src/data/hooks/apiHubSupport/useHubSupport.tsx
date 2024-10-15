import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { SupportDataResponse } from '@/types/support.type';
import { getHubSupport } from '@/data/api/apiHubSupport';

export const useFetchHubSupport = () =>
  useQuery<SupportDataResponse, AxiosError>({
    queryKey: ['get-hub-support'],
    queryFn: getHubSupport,
  });
