import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getRetentions } from '@/__mocks__/infrastructures/infrastructures.adapter';
import { RetentionParams } from '@/data/api/infrastructures.props';
import { Retention } from '@/types/infrastructures.type';

export const getRetentionsQueryKey = ({
  resourceName,
  infrastructureId,
}: Omit<RetentionParams, 'signal'>) => ['retentions', resourceName, infrastructureId];

export const useRetentions = (
  { resourceName, infrastructureId }: Omit<RetentionParams, 'signal'>,
  queryOptions?: Omit<UseQueryOptions<Retention[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<Retention[], Error>({
    queryKey: getRetentionsQueryKey({ resourceName, infrastructureId }),
    queryFn: ({ signal }) => getRetentions({ resourceName, infrastructureId, signal }),
    enabled: !!resourceName && !!infrastructureId,
    ...queryOptions,
  });
};
