import { useQuery } from '@tanstack/react-query';
import { get2faStatus } from '@/data/api/statusApi';

export const useFetch2faStatus = () =>
  useQuery({
    queryKey: ['get2faStatus'],
    queryFn: get2faStatus,
  });
