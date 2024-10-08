import { keepPreviousData, QueryClient, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { instancesQueryKey } from '@/utils';
import { getCatalog } from '@/data/api/catalog';
import { TCatalogDto } from '@/types/catalog/api.types';
import { useAppStore } from '@/store/hooks/useAppStore';
import { modelSelector } from './selectors/models.selector';
import { regionSelector } from './selectors/regions.selector';

export type TUseCatalogOptionsArg = {
  selector?: TUseCatalogSelector;
  enabled?: boolean;
};
export type TUseCatalogSelector = 'modelSelector' | 'regionSelector' | void;

type TSelectorData<T> = T extends 'modelSelector'
  ? ReturnType<typeof modelSelector>
  : T extends 'regionSelector'
  ? ReturnType<typeof regionSelector>
  : TCatalogDto;

export const updateCatalogQueryData = (
  queryClient: QueryClient,
  projectId: string,
  regionName: string,
) => {
  queryClient.setQueryData(
    instancesQueryKey(projectId, ['catalog']),
    (prev: TCatalogDto | undefined): TCatalogDto | undefined =>
      prev
        ? {
            ...prev,
            regions: prev.regions.map((prevRegion) =>
              prevRegion.name === regionName
                ? { ...prevRegion, isActivated: true }
                : prevRegion,
            ),
          }
        : prev,
  );
};

export const useCatalog = <T extends TUseCatalogSelector = void>(
  projectId: string,
  { selector, enabled }: TUseCatalogOptionsArg = {},
) => {
  const selectedModel = useAppStore.getState().modelName();
  const queryKey = useMemo(() => instancesQueryKey(projectId, ['catalog']), [
    projectId,
  ]);

  const fetchCatalog = useCallback(() => getCatalog(projectId), [projectId]);

  const catalogSelector = useCallback(
    (rawData: TCatalogDto): TSelectorData<T> => {
      switch (selector) {
        case 'modelSelector':
          return modelSelector(rawData) as TSelectorData<T>;
        case 'regionSelector': {
          return regionSelector(rawData, selectedModel) as TSelectorData<T>;
        }
        default:
          return rawData as TSelectorData<T>;
      }
    },
    [selector, selectedModel],
  );

  return useQuery({
    queryKey,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: fetchCatalog,
    placeholderData: keepPreviousData,
    ...(selector !== undefined && { select: catalogSelector }),
    ...(enabled !== undefined && { enabled }),
  });
};
