import { QueryClient, InfiniteData } from '@tanstack/react-query';
import { TAggregatedInstanceDto } from '@/types/instance/api.type';
import { instanceQueryKeyPredicate, listQueryKeyPredicate } from './queryKeys';
import { TInstance } from '@/types/instance/entity.type';

export const selectInstanceById = (
  projectId: string,
  instanceId: string,
  queryClient: QueryClient,
): TInstance | undefined => {
  const queries = queryClient.getQueriesData<TInstance[]>({
    predicate: instanceQueryKeyPredicate(projectId, instanceId),
  });

  return queries
    .flatMap(([, queryData]) => queryData)
    .find((instance) => instance?.id === instanceId);
};

export const selectAggregatedInstanceById = (
  projectId: string,
  id: string | undefined,
  queryClient: QueryClient,
): TAggregatedInstanceDto | undefined => {
  if (!id) return undefined;

  const data = queryClient.getQueriesData<
    InfiniteData<TAggregatedInstanceDto[], number>
  >({
    predicate: listQueryKeyPredicate(projectId),
  });

  return data.reduce((acc: TAggregatedInstanceDto | undefined, [, result]) => {
    if (acc) return acc;
    if (result) {
      const foundInstance = result.pages.flat().find((elt) => elt.id === id);
      return foundInstance ?? acc;
    }
    return acc;
  }, undefined);
};
