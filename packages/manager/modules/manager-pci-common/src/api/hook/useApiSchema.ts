import { useQuery } from '@tanstack/react-query';
import { getApiSchema } from '../data/api-schema';

export const useGetApiSchema = () =>
  useQuery({
    queryKey: ['cloud.json'],
    queryFn: () => getApiSchema(),
  });
