import { useQuery } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getServerContainer, TObject } from '@/api/data/container';
import { paginateResults, sortResults } from '@/helpers';
import UseStandardInfrequentAccessAvailability from '@/hooks/useStandardInfrequentAccessAvailability';

export const getContainerQueryKey = ({
  projectId,
  region,
  containerName,
  containerId,
}: {
  projectId: string;
  region: string;
  containerName: string;
  containerId: string;
}) => [
  'project',
  projectId,
  'region',
  region,
  'server-container',
  containerId || containerName,
];

export const useServerContainer = (
  projectId: string,
  region: string,
  name: string,
  id: string,
) => {
  return useQuery({
    queryKey: getContainerQueryKey({
      projectId,
      region,
      containerId: id,
      containerName: name,
    }),
    queryFn: () => getServerContainer(projectId, region, name, id),
    enabled: !!projectId && !!name && !!region,
    staleTime: 0,
  });
};

export const usePaginatedObjects = (
  projectId: string,
  region: string,
  name: string,
  id: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const { t } = useTranslation('container');

  const { data: container, error, isLoading, isPending } = useServerContainer(
    projectId,
    region,
    name,
    id,
  );

  const hasStandardInfrequentAccess = UseStandardInfrequentAccessAvailability();

  return useMemo(
    () => ({
      isLoading,
      isPending,
      paginatedObjects: paginateResults<TObject | { index: string }>(
        sortResults<TObject>(
          applyFilters<TObject>(
            container?.objects?.map((object) => ({
              ...object,
              search: `${object.key} ${object.name} ${t(
                hasStandardInfrequentAccess
                  ? `pci_projects_project_storages_containers_container_storage_class_standard_infrequent_access_${object.storageClass}`
                  : `pci_projects_project_storages_containers_container_storage_class_${object.storageClass}`,
              )}`,
            })) || [],
            filters,
          ),
          sorting,
        ).map((obj, index) => ({
          index,
          ...obj,
        })),
        pagination,
      ),
      allObjects: container?.objects,
      error,
    }),
    [container, error, isLoading, isPending, pagination, sorting, filters],
  );
};
