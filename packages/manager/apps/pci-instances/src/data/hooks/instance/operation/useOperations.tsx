import { queryOptions, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getOperations } from '@/data/api/operation';

export const getOperationsQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: [projectId, 'operations'],
    queryFn: () => getOperations(projectId),
  });

export const useOperations = (
  projectId: string,
  filters?: {
    section?: string;
    action?: string;
  },
  options?: Pick<
    ReturnType<typeof getOperationsQueryOptions>,
    'refetchInterval' | 'refetchIntervalInBackground'
  >,
) => {
  const operationsQueryOptions = useMemo(
    () => ({ ...getOperationsQueryOptions(projectId), ...options }),
    [projectId, options],
  );

  const { data: operations } = useQuery(operationsQueryOptions);

  const filteredOperations = useMemo(
    () =>
      !!filters && !!operations
        ? operations.filter((operation) => {
            if (filters.section && operation.section !== filters.section)
              return false;
            if (filters.action && operation.action !== filters.action)
              return false;

            return true;
          })
        : operations ?? [],
    [operations, filters],
  );

  return {
    operations: filteredOperations,
  };
};
