import { queryOptions, useQuery } from '@tanstack/react-query';

import { getBaremetalDetails } from '@/data/api/baremetal/baremetals.requests';

import { BAREMETAL_QUERY_KEYS } from './useBaremetalsList';

export type GetBaremetalDetailsParams = {
  serviceName: string;
};

export const BAREMETAL_DETAILS_QUERY_KEY = (serviceName: string) => [
  ...BAREMETAL_QUERY_KEYS.baremetals,
  serviceName,
];

export const useBaremetalDetailsOptions = ({ serviceName }: GetBaremetalDetailsParams) => {
  return queryOptions({
    queryFn: () => getBaremetalDetails(serviceName),
    queryKey: BAREMETAL_DETAILS_QUERY_KEY(serviceName),
    enabled: !!serviceName,
  });
};

export const useBaremetalDetails = ({ serviceName, ...options }: { serviceName?: string }) => {
  return useQuery({
    ...useBaremetalDetailsOptions({ serviceName: serviceName! }),
    ...options,
  });
};
