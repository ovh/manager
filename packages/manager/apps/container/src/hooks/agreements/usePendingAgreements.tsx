import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import fetchPendingAgreements from '@/api/agreements';
import { Agreements } from '@/types/agreements';

const usePendingAgreements = (options?: Partial<DefinedInitialDataOptions<Agreements[]>>) =>
  useQuery({
    ...options,
    queryKey: ['pending-agreements'],
    queryFn: fetchPendingAgreements,
  });

export default usePendingAgreements;
