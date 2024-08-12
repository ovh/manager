import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovhcloud/manager-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { compareFunction, paginateResults } from '@/helpers';
import { getAllRegistries, getRegistryPlan, TRegistry } from '../data/registry';

export const getRegistryQueryPrefix = (projectId: string) => [
  'project',
  projectId,
  'registry',
];

export const getAllRegistriesQueryKey = (projectId: string) => [
  ...getRegistryQueryPrefix(projectId),
];

export const getRegistryPlanQueryKey = (
  projectId: string,
  registryId: string,
) => [...getRegistryQueryPrefix(projectId), registryId, 'plan'];

export const useGetAllRegistries = (projectId: string) =>
  useQuery({
    queryKey: getAllRegistriesQueryKey(projectId),
    queryFn: () => getAllRegistries(projectId),
  });

export const useGetRegistryPlan = (projectId: string, registryId: string) =>
  useQuery({
    queryKey: getRegistryPlanQueryKey(projectId, registryId),
    queryFn: () => getRegistryPlan(projectId, registryId),
  });

export const sortRegistries = (
  registries: TRegistry[],
  sorting: ColumnSort,
): TRegistry[] => {
  const data = [...registries];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(compareFunction<TRegistry>(sortKey as keyof TRegistry));
    if (desc) {
      data.reverse();
    }
  }

  return data;
};

export const useAllRegistries = (
  projectId: string,
  pagination: PaginationState,
  filters: Filter[],
  sorting: ColumnSort,
) => {
  const { data: allRegistries, error, isPending } = useGetAllRegistries(
    projectId,
  );

  return useMemo(
    () => ({
      isPending,
      data: paginateResults<TRegistry>(
        applyFilters(sortRegistries(allRegistries || [], sorting), filters),
        pagination,
      ),
      error,
    }),
    [allRegistries, isPending, error, pagination, filters, sorting],
  );
};
