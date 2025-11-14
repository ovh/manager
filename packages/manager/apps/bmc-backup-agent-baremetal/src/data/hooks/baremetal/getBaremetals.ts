import { useQuery } from '@tanstack/react-query';

import { getBaremetalDetails } from '@/data/api/baremetal/baremetals.details';

export const BAREMETAL_QUERY_KEYS = {
  baremetal: ['baremetal'],
};

export const useBaremetalDetails = () =>
  useQuery({
    queryKey: BAREMETAL_QUERY_KEYS.baremetal,
    queryFn: () => getBaremetalDetails(),
  });
