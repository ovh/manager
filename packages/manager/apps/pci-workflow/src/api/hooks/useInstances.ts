import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useTranslatedMicroRegions } from '@ovhcloud/manager-components';
import {
  getAllInstance,
  getFlavor,
  sortResults,
  TInstanceOptions,
} from '@/api/data/instance';
import { TInstance } from '@/type';
import { paginateResults } from '@/helpers';

export const getInstancesQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'instances'],
  queryFn: () => getAllInstance(projectId),
});

export const getStatusGroup = (status: string) => {
  if (
    [
      'BUILDING',
      'REBOOT',
      'REBUILD',
      'REVERT_RESIZE',
      'SOFT_DELETED',
      'VERIFY_RESIZE',
      'MIGRATING',
      'RESIZE',
      'BUILD',
      'SHUTOFF',
      'RESCUE',
      'SHELVED',
      'SHELVED_OFFLOADED',
      'RESCUING',
      'UNRESCUING',
      'SNAPSHOTTING',
      'RESUMING',
      'HARD_REBOOT',
      'PASSWORD',
      'PAUSED',
    ].includes(status)
  ) {
    return 'PENDING';
  }

  if (
    ['DELETED', 'ERROR', 'STOPPED', 'SUSPENDED', 'UNKNOWN'].includes(status)
  ) {
    return 'ERROR';
  }

  if (['ACTIVE', 'RESCUED', 'RESIZED'].includes(status)) {
    return 'ACTIVE';
  }
  return status.toUpperCase();
};

export const useAllInstances = (projectId: string) => {
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { data: instances, isPending } = useQuery({
    ...getInstancesQuery(projectId),
  });

  return useQueries({
    queries: (instances || [])?.map((q) => ({
      queryKey: ['project', projectId, 'flavor', q.flavorId],
      queryFn: () => getFlavor(projectId, q.flavorId),
      enabled: !isPending,
    })),
    combine: (results) => ({
      isPending: results.some((r) => r.isPending) || isPending,
      data: instances?.map((instance) => {
        const flavor = results.find(
          (result) => result.data?.id === instance.flavorId,
        )?.data;
        return {
          ...instance,
          statusGroup: getStatusGroup(instance.status),
          regionName: translateMicroRegion(instance.region),
          flavorName: flavor?.name,
          search: `${instance.name} ${instance.regionName} ${instance.statusGroup} ${flavor?.name}`,
        };
      }),
      error: results.find((r) => r.error),
    }),
  });
};

export const useInstances = (
  projectId: string,
  { pagination, sorting }: TInstanceOptions,
  filters: Filter[] = [],
) => {
  const { data: instances, error, isPending } = useAllInstances(projectId);
  return useMemo(
    () => ({
      isPending,
      error,
      data: paginateResults<TInstance>(
        sortResults(
          applyFilters(((instances as unknown) as TInstance[]) || [], filters),
          sorting,
        ),
        pagination,
      ),
    }),
    [isPending, error, instances, pagination, sorting, filters],
  );
};
