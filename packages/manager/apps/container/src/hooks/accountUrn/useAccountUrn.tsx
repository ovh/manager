import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { fetchAccountUrn } from '@/api/authorizations';

const useAccountUrn = (options?: Partial<DefinedInitialDataOptions<string>>) =>
  useQuery({
    ...options,
    queryKey: ['account-urn'],
    queryFn: fetchAccountUrn,
  });

export default useAccountUrn;
