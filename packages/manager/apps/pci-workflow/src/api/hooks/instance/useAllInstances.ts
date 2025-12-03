import { useMemo } from 'react';

import { queryOptions, usePrefetchQuery, useQueries, useQuery } from '@tanstack/react-query';

import { getProductAvailabilityQuery, getProjectRegions } from '@ovh-ux/manager-pci-common';

import { getFlavor } from '@/api/data/flavor';
import { getInstances } from '@/api/data/instance';
import {
  TInstance,
  isSameInstanceId,
  mapInstance,
} from '@/api/hooks/instance/selector/instances.selector';
import { useRegionTranslation } from '@/api/hooks/region';
import { useMe } from '@/api/hooks/user';
import { TEInstance } from '@/types/instance/entity';

const getInstancesQueryOptions = (projectId: string) =>
  queryOptions({
    queryFn: () => getInstances(projectId),
    queryKey: [projectId, 'instances'],
  });

const getProductAvailabilityQueryOptions = (projectId: string, ovhSubsidiary: string) =>
  queryOptions({
    ...getProductAvailabilityQuery(projectId, ovhSubsidiary, {
      addonFamily: 'snapshot',
    }),
  });

const getFlavorQueryOptions = (projectId: string, region: string, flavorId: string) =>
  queryOptions({
    queryFn: () => getFlavor(projectId, region, flavorId),
    queryKey: [projectId, 'flavor', region, flavorId],
  });

export const getProjectRegionsQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getProjectRegions(projectId),
  });

export const useAllInstances = (projectId: string) => {
  const { me } = useMe();
  const { translateMicroRegion } = useRegionTranslation();

  const instancesQueryOption = useMemo(() => getInstancesQueryOptions(projectId), [projectId]);
  const productAvailabilityQueryOptions = useMemo(
    () => getProductAvailabilityQueryOptions(projectId, me?.ovhSubsidiary),
    [projectId, me?.ovhSubsidiary],
  );
  const projectRegionsQueryOptions = useMemo(
    () => getProjectRegionsQueryOptions(projectId),
    [projectId],
  );

  const { data: instances, isPending } = useQuery(instancesQueryOption);
  const { data: snapshotAvailability } = useQuery(productAvailabilityQueryOptions);
  const { data: regions } = useQuery(projectRegionsQueryOptions);

  const { flavors } = useQueries({
    queries: (instances || ([] satisfies TEInstance[])).map((i) =>
      getFlavorQueryOptions(projectId, i.region, i.flavorId),
    ),
    combine: (flavorsQueries) => ({
      flavors: flavorsQueries
        .map(({ data }) => data)
        .filter((flavor): flavor is NonNullable<typeof flavor> => !!flavor),
    }),
  });

  return {
    instances: useMemo<TInstance[]>(
      () =>
        mapInstance(
          instances ?? [],
          flavors,
          translateMicroRegion,
          snapshotAvailability ?? null,
          regions ?? null,
        ),
      [instances, flavors, translateMicroRegion, snapshotAvailability, regions],
    ),
    isPending,
  };
};

export const usePrefetchInstances = (projectId: string) => {
  const { me } = useMe();

  const instancesQueryOption = useMemo(() => getInstancesQueryOptions(projectId), [projectId]);
  const productAvailabilityQueryOptions = useMemo(
    () => getProductAvailabilityQueryOptions(projectId, me?.ovhSubsidiary),
    [projectId, me?.ovhSubsidiary],
  );
  const projectRegionsQueryOptions = useMemo(
    () => getProjectRegionsQueryOptions(projectId),
    [projectId],
  );

  usePrefetchQuery(instancesQueryOption);
  usePrefetchQuery(productAvailabilityQueryOptions);
  usePrefetchQuery(projectRegionsQueryOptions);
};

export const useInstance = (projectId: string, instanceId: TInstance['id'] | null) => {
  const { instances } = useAllInstances(projectId);

  return {
    instance: useMemo(
      () =>
        instanceId ? (instances.find((i) => isSameInstanceId(i.id, instanceId)) ?? null) : null,
      [instances, instanceId],
    ),
  };
};
