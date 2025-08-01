import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getAccountUrn } from '@/data/api/iam';

export const useAccountUrn = (): UseQueryResult<string, ApiError> =>
  useQuery({
    queryKey: ['iam/resource', 'account'],
    queryFn: () => getAccountUrn(),
  });
