import { InfiniteData, QueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import fp from 'lodash/fp';
import { buildPartialAggregatedInstanceDto } from '@/data/hooks/instance/builder/instanceDto.builder';
import { TAggregatedInstanceDto } from '@/types/instance/api.type';
import { TInstance, TPartialInstance } from '@/types/instance/entity.type';
import { listQueryKeyPredicate, instanceQueryKey } from './queryKeys';

type TUpdateAggregatedInstancesFromCache = (
  queryClient: QueryClient,
  payload: {
    projectId: string;
    instance: Pick<TAggregatedInstanceDto, 'id'> &
      Partial<TAggregatedInstanceDto>;
  },
) => void;

export const updateAggregatedInstancesFromCache: TUpdateAggregatedInstancesFromCache = (
  queryClient: QueryClient,
  { projectId, instance },
) => {
  const queries = queryClient.getQueriesData<
    InfiniteData<TAggregatedInstanceDto[]>
  >({
    predicate: listQueryKeyPredicate(projectId),
  });

  queries.forEach(([queryKey, queryData]) => {
    if (!queryData) return;

    const updatedPages: TAggregatedInstanceDto[][] = queryData.pages.map(
      (page): TAggregatedInstanceDto[] => {
        const foundIndex = fp.findIndex(fp.propEq('id', instance.id), page);
        if (foundIndex === -1) return page;

        const previousInstance = page[foundIndex];
        const mergedInstance = { ...previousInstance, ...instance };

        if (isEqual(previousInstance, mergedInstance)) return page;

        return fp.update(
          foundIndex,
          () => mergedInstance,
          page,
        ) as TAggregatedInstanceDto[];
      },
    );

    const isPageModified = updatedPages.some(
      (page, i) => page !== queryData.pages[i],
    );

    if (!isPageModified) return;

    queryClient.setQueryData<InfiniteData<TAggregatedInstanceDto[], number>>(
      queryKey,
      (prevData) => {
        if (!prevData) return undefined;
        return { ...prevData, pages: updatedPages };
      },
    );
  });
};

type TUpdateInstanceFromCacheArgs = {
  queryClient: QueryClient;
  projectId: string;
  instance: TPartialInstance;
  region?: string | null;
};

export const updateInstanceFromCache = ({
  queryClient,
  projectId,
  instance,
  region = null,
}: TUpdateInstanceFromCacheArgs) =>
  queryClient.setQueryData<TInstance>(
    instanceQueryKey(projectId, instance.id, region),
    (prevData) => {
      if (!prevData) return undefined;
      return { ...prevData, ...instance };
    },
  );

type TUpdateAllInstancesFromCacheArgs = {
  projectId: string;
  instance: TPartialInstance;
  region?: string;
};

export const updateAllInstancesFromCache = (
  queryClient: QueryClient,
  { projectId, instance, region }: TUpdateAllInstancesFromCacheArgs,
) => {
  updateAggregatedInstancesFromCache(queryClient, {
    projectId,
    instance: buildPartialAggregatedInstanceDto(instance),
  });

  updateInstanceFromCache({
    queryClient,
    projectId,
    instance,
    region,
  });
};

type TResetInstanceCacheArgs = {
  projectId: string;
  instanceId: string;
  region: string;
};

export const resetInstanceCache = (
  queryClient: QueryClient,
  { projectId, region, instanceId }: TResetInstanceCacheArgs,
) =>
  queryClient.invalidateQueries({
    queryKey: instanceQueryKey(projectId, instanceId, region),
  });
