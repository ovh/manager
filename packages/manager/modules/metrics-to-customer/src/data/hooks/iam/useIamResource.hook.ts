import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getResource } from '@/data/api/iam.api';
import { IamResourcesResponse } from '@/types/iam.type';

export const getIamResourceQueryKey = (resourceURN: string) => [
  'resourceURN',
  resourceURN,
];

export const useIamResource = (
  resourceURN: string,
  options?: Omit<
    UseQueryOptions<IamResourcesResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: getIamResourceQueryKey(resourceURN),
    queryFn: ({ signal }) => getResource({ resourceURN, signal }),
    enabled: !!resourceURN,
    ...options,
  });
};
