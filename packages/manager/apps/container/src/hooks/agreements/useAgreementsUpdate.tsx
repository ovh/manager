import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import fetchAgreementsUpdates from '@/api/agreements';
import { Agreements } from '@/types/agreements';

const useAgreementsUpdate = (options?: Partial<DefinedInitialDataOptions<Agreements[]>>) =>
  useQuery({
    ...options,
    queryKey: ['agreements'],
    queryFn: fetchAgreementsUpdates,
  });

export default useAgreementsUpdate;
