import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useGetProjectRegions } from '@ovh-ux/manager-pci-common';
import { getStorages, TStorage } from '../data/storages';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
} from '@/constants';
import { paginateResults } from '@/helpers';

export const sortStorages = (sorting: ColumnSort, storages: TStorage[]) => {
  const order = sorting.desc ? -1 : 1;
  switch (sorting?.id) {
    case 'name':
    case 'region':
    case 'deploymentMode':
    case 'offer':
    case 'containerType':
      return storages.sort(
        (a, b) => order * a[sorting.id]?.localeCompare(b[sorting.id]),
      );
    case 'usedSpace':
    case 'storedObjects':
      return storages.sort((a, b) => order * (a[sorting.id] - b[sorting.id]));
    default:
      return storages;
  }
};

export const getStorageQueryKey = (projectId: string) => [
  'project',
  projectId,
  'storages',
];

export const useAllStorages = (projectId: string) =>
  useQuery({
    queryKey: getStorageQueryKey(projectId),
    queryFn: () => getStorages(projectId),
  });

export const useStorages = (
  projectId: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
  availability: {
    isLocalZoneAvailable: boolean;
    is3azAvailable: boolean;
  },
) => {
  const { i18n, t } = useTranslation('pci-storages-containers');
  const queryClient = useQueryClient();

  const {
    data: storages,
    error,
    isFetching,
    isLoading: isStoragesLoading,
    isPending: isStoragesPending,
  } = useAllStorages(projectId);

  const {
    data: regions,
    isLoading: isRegionsLoading,
    isPending: isRegionsPending,
  } = useGetProjectRegions(projectId);

  const mappedStorages = useMemo(() => {
    if (storages && regions) {
      return storages.resources.map((storage) => {
        const deploymentMode = regions.find(
          (region) => region.name === storage.region,
        )?.type;
        let mode: string;
        switch (deploymentMode) {
          case OBJECT_CONTAINER_MODE_MULTI_ZONES:
            mode = t(
              `pci_projects_project_storages_containers_deployment_mode_region-3-az`,
            );
            break;
          case OBJECT_CONTAINER_MODE_MONO_ZONE:
            mode =
              availability.isLocalZoneAvailable && availability.is3azAvailable
                ? t(
                    'pci_projects_project_storages_containers_deployment_mode_region',
                  )
                : t(
                    'pci_projects_project_storages_containers_deployment_mode_flipping_region',
                  );
            break;
          case OBJECT_CONTAINER_MODE_LOCAL_ZONE:
            mode = t(
              'pci_projects_project_storages_containers_deployment_mode_localzone',
            );
            break;
          default:
        }
        return {
          ...storage,
          mode,
          offer: t(
            storage?.s3StorageType
              ? 'pci_projects_project_storages_containers_offer_s3'
              : 'pci_projects_project_storages_containers_offer_swift',
          ),
          deploymentMode,
          storedObjects: storage.storedObjects || 0,
          usedSpace: storage.storedBytes || storage.objectsSize || 0,
        };
      });
    }
    return [];
  }, [storages, regions, i18n?.language, availability]);

  const isLoading = isStoragesLoading || isRegionsLoading;
  const isPending = isStoragesPending || isRegionsPending;

  return useMemo(
    () => ({
      isLoading,
      isPending,
      paginatedStorages: paginateResults<TStorage>(
        sortStorages(sorting, applyFilters(mappedStorages, filters)),
        pagination,
      ),
      allStorages: storages,
      error,
      isRefreshing: isFetching,
      refresh: () =>
        queryClient.invalidateQueries({
          queryKey: getStorageQueryKey(projectId),
        }),
    }),
    [
      mappedStorages,
      error,
      isLoading,
      isPending,
      isFetching,
      pagination,
      sorting,
      filters,
    ],
  );
};
