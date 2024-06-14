import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { get2faStatus } from '@/data/api/statusApi';
import { Status2fa } from '@/types/status.type';

export const useFetch2faStatus = () =>
  useQuery<Status2fa, AxiosError>({
    queryKey: ['get2faStatus'],
    queryFn: get2faStatus,
    retry: 0,
  });
