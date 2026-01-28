import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getRetentions } from '@/__mocks__/infrastructures/infrastructures.adapter';
import { RetentionParams } from '@/data/api/infrastructures.props';
import { Retention } from '@/types/infrastructures.type';

export const getRetentionsQueryKey = ({
  resourceName,
  infrastructureId,
  retentionTypes,
}: Omit<RetentionParams, 'signal'>) => [
  'retentions',
  resourceName,
  infrastructureId,
  retentionTypes,
];

export const useRetentions = (
  {
    resourceName,
    infrastructureId,
    retentionTypes = 'METRICS_TENANT',
  }: Omit<RetentionParams, 'signal'>,
  queryOptions?: Omit<UseQueryOptions<Retention[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<Retention[], Error>({
    queryKey: getRetentionsQueryKey({
      resourceName,
      infrastructureId,
      retentionTypes,
    }),
    queryFn: ({ signal }) =>
      getRetentions({ resourceName, infrastructureId, retentionTypes, signal }),
    enabled: !!resourceName && !!infrastructureId,
    ...queryOptions,
  });
};
