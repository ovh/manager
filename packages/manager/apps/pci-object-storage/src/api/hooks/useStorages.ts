import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { ApiError, applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useGetProjectRegions } from '@ovh-ux/manager-pci-common';
import {
  deleteSwiftContainer,
  deleteS3Container,
  getStorages,
  TStorage,
  updateStorage,
  createSwiftStorage,
  createS3Storage,
  setContainerAsStatic,
  setContainerAsPublic,
  updateStorageType,
  getStorageAccess,
  Replication,
} from '../data/storages';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
  OBJECT_CONTAINER_TYPE_PUBLIC,
  OBJECT_CONTAINER_TYPE_STATIC,
  ReplicationStorageClass,
} from '@/constants';
import { paginateResults } from '@/helpers';
import { addUser, deleteSwiftObject, TStorageObject } from '../data/objects';
import { getContainerQueryKey } from './useContainer';
import { useGetRegion } from './useRegion';

export const sortStorages = (sorting: ColumnSort, storages: TStorage[]) => {
  const order = sorting.desc ? -1 : 1;
  switch (sorting?.id) {
    case 'name':
    case 'region':
    case 'mode':
    case 'offer':
    case 'containerType':
      return storages?.sort(
        (a, b) => order * a[sorting.id]?.localeCompare(b[sorting.id]),
      );
    case 'usedSpace':
    case 'containerCount':
      return storages?.sort((a, b) => order * (a[sorting.id] - b[sorting.id]));
    default:
      return storages;
  }
};

export const getAllStoragesQueryKey = (projectId: string) => [
  'project',
  projectId,
  'storages',
];

export const useAllStorages = (projectId: string) =>
  useQuery({
    queryKey: getAllStoragesQueryKey(projectId),
    queryFn: () => getStorages(projectId),
  });

export const useMappedStorages = (projectId: string) => {
  const { i18n, t } = useTranslation('containers');

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

  const isLoading = isStoragesLoading || isRegionsLoading;
  const isPending = isStoragesPending || isRegionsPending;

  const mappedStorages = useMemo(() => {
    if (storages && regions) {
      return storages.resources.map((storage) => {
        const deploymentMode = regions.find(
          (region) => region.name === storage.region,
        )?.type;

        return {
          ...storage,
          offer: t(
            storage?.s3StorageType
              ? 'pci_projects_project_storages_containers_offer_s3'
              : 'pci_projects_project_storages_containers_offer_swift',
          ),
          deploymentMode,
          containerCount: storage.storedObjects || storage.objectsCount || 0,
          usedSpace: storage.storedBytes || storage.objectsSize || 0,
        };
      });
    }
    return [];
  }, [storages, regions, i18n?.language]);

  return {
    data: mappedStorages,
    isLoading,
    isPending,
    allStorages: storages,
    error,
    isRefreshing: isFetching,
  };
};
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
  const { i18n, t } = useTranslation(['containers', 'containers/add']);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isPending,
    isRefreshing,
    allStorages,
    error,
  } = useMappedStorages(projectId);

  const mappedStorages = useMemo(() => {
    if (data) {
      return data.map((storage) => {
        const { deploymentMode } = storage;
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
                    'containers/add:pci_projects_project_storages_containers_add_deployment_mode_flipping_region',
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
        };
      });
    }
    return [];
  }, [data, i18n?.language, availability]);

  return useMemo(
    () => ({
      isLoading,
      isPending,
      paginatedStorages: paginateResults<TStorage>(
        sortStorages(sorting, applyFilters(mappedStorages, filters)),
        pagination,
      ),
      allStorages,
      error,
      isRefreshing,
      refresh: () =>
        queryClient.invalidateQueries({
          queryKey: getAllStoragesQueryKey(projectId),
        }),
    }),
    [
      mappedStorages,
      error,
      isLoading,
      isPending,
      isRefreshing,
      pagination,
      sorting,
      filters,
    ],
  );
};

interface UseDeleteStorageProps {
  projectId: string;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}

export const useDeleteStorage = ({
  projectId,
  onSuccess,
  onError,
}: UseDeleteStorageProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      storage,
      objects,
    }: {
      storage: TStorage;
      objects: TStorageObject[];
    }) => {
      if (storage.s3StorageType) {
        return deleteS3Container(
          projectId,
          storage.region,
          storage.s3StorageType,
          storage.name,
        );
      }
      const { endpoints, token } = await getStorageAccess({ projectId });
      const url = endpoints?.find(
        ({ region: endpointRegion }) => endpointRegion === storage.region,
      )?.url;

      const deletePromises = objects.map((object) =>
        deleteSwiftObject({
          storageName: storage.name,
          objectName: object.name,
          token,
          url,
        }),
      );
      await Promise.all(deletePromises);
      // adding some delay to avoid api deletion error
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return deleteSwiftContainer(projectId, storage.id);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getAllStoragesQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    deleteStorage({
      storage,
      objects,
    }: {
      storage: TStorage;
      objects: TStorageObject[];
    }) {
      return mutation.mutate({ storage, objects });
    },
    ...mutation,
  };
};

export const useStorage = (
  projectId: string,
  storageId: string,
  storageRegion: string,
) => {
  const {
    data: storages,
    error: errorStorages,
    isPending: isStoragesPending,
  } = useAllStorages(projectId);

  return useMemo(() => {
    return {
      isPending: isStoragesPending,
      storage: storages?.resources.find(
        (c) =>
          (c.id === storageId || (c.name === storageId && !c.id)) &&
          c.region === storageRegion,
      ),
      error: errorStorages,
      storages,
    };
  }, [storages, isStoragesPending, errorStorages]);
};

interface UseUpdateStorageProps {
  projectId: string;
  region: string;
  name: string;
  s3StorageType: string;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}

export type TReplicationRule = {
  id: string;
  status: 'enabled' | 'disabled';
  filter?: { prefix: string; tags: { [key: string]: string } };

  destination?: {
    name?: string;
    region: string;
    storageClass?: ReplicationStorageClass;
  };
  deleteMarkerReplication: 'enabled' | 'disabled';
  priority: number;
};

export const useUpdateStorage = ({
  projectId,
  region,
  name,
  s3StorageType,
  onSuccess,
  onError,
}: UseUpdateStorageProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updateData: {
      versioning?: { status: string };
      encryption?: { sseAlgorithm: string };
      replication?: {
        rules: TReplicationRule[];
      };
    }) => {
      return updateStorage({
        projectId,
        region,
        name,
        s3StorageType,
        ...updateData,
      });
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getContainerQueryKey({
          projectId,
          region,
          containerId: name,
          containerName: name,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: getAllStoragesQueryKey(projectId),
      });
      onSuccess();
    },
  });

  return {
    updateContainer: mutation.mutate,
    addReplicationRule: (rule: TReplicationRule) => {
      return mutation.mutate({
        replication: {
          rules: [rule],
        },
      });
    },
    ...mutation,
  };
};

export interface UseCreateContainerArgs {
  offer: string;
  archive?: boolean;
  containerName: string;
  region: string;
  ownerId?: number;
  encryption?: string;
  versioning?: boolean;
  containerType?: string;
  offsiteReplication?: boolean;
  offsiteReplicationRegion?: string;
  replication?: Replication;
}

export const useCreateContainer = ({
  projectId,
  onSuccess,
  onError,
}: {
  projectId: string;
  onSuccess: (container: TStorage) => void;
  onError: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: UseCreateContainerArgs) => {
      let result = null;
      if (args.offer === OBJECT_CONTAINER_OFFER_SWIFT) {
        result = await createSwiftStorage({
          projectId,
          archive: args.archive || false,
          containerName: args.containerName,
          region: args.region,
        });
      } else if (args.offer === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD) {
        result = createS3Storage({
          projectId,
          containerName: args.containerName,
          ownerId: args.ownerId,
          region: args.region,
          encryption: args.encryption,
          versioning: args.versioning,
          ...(args.offsiteReplication && {
            replication: {
              rules: [
                {
                  id: '',
                  ...(args.offsiteReplicationRegion && {
                    destination: {
                      region: args.offsiteReplicationRegion,
                    },
                  }),
                  status: 'enabled',
                  priority: 1,
                  deleteMarkerReplication: 'enabled',
                },
              ],
            },
          }),
        });
      }
      if (!result) throw new Error(`${args.offer}: unknown container offer!`);
      if (args.containerType === OBJECT_CONTAINER_TYPE_STATIC) {
        await setContainerAsStatic({
          projectId,
          containerId: result.id,
        });
      } else if (args.containerType === OBJECT_CONTAINER_TYPE_PUBLIC) {
        await setContainerAsPublic({
          projectId,
          containerName: args.containerName,
          region: args.region,
        });
      }
      return result;
    },
    onError,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: getAllStoragesQueryKey(projectId),
      });
      onSuccess(result);
    },
  });

  return {
    createContainer: (container: UseCreateContainerArgs) =>
      mutation.mutate(container),
    ...mutation,
  };
};

type AddUserProps = {
  projectId: string;
  storageId: string;
  region: string;
  userId: number;
  role: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAddUser = ({
  projectId,
  storageId,
  region,
  userId,
  role,
  onError,
  onSuccess,
}: AddUserProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () =>
      addUser({ projectId, region, storageId, userId, role }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getAllStoragesQueryKey(projectId),
      });
      onSuccess();
    },
  });

  return {
    addUser: () => mutation.mutate(),
    ...mutation,
  };
};

export interface UpdateStorageTypeProps {
  projectId: string;
  onSuccess: (containerType: TStorage['containerType']) => void;
  onError: (error: ApiError) => void;
}

export const useUpdateStorageType = ({
  projectId,
  onSuccess,
  onError,
}: UpdateStorageTypeProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      containerId,
      containerType,
    }: {
      containerId: string;
      containerType: TStorage['containerType'];
    }) =>
      updateStorageType({
        projectId,
        containerId,
        containerType,
      }).then(() => containerType),
    onError,
    onSuccess: async (containerType) => {
      await queryClient.invalidateQueries({
        queryKey: getAllStoragesQueryKey(projectId),
      });
      onSuccess(containerType);
    },
  });
  return {
    updateStorageType(
      containerId: string,
      containerType: TStorage['containerType'],
    ) {
      return mutation.mutate({ containerId, containerType });
    },
    ...mutation,
  };
};

export const useStorageAccess = (projectId: string, storage: TStorage) => {
  return useQuery({
    queryKey: ['project', projectId, 'storage-access'],
    queryFn: () => getStorageAccess({ projectId }),
    enabled: !!projectId && !!storage && !storage?.s3StorageType,
  });
};

export const useStorageEndpoint = (projectId: string, storage: TStorage) => {
  const { data: region, isPending: isRegionPending } = useGetRegion(
    projectId,
    storage?.region,
  );
  const { data: access, isPending: isAccessPending } = useStorageAccess(
    projectId,
    storage,
  );
  const isPending = isRegionPending || isAccessPending;
  return {
    isPending,
    region,
    url: storage?.s3StorageType
      ? region?.services.find(
          (service) => service.name === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
        )?.endpoint
      : `${
          access?.endpoints?.find(({ region: reg }) => reg === region?.name)
            ?.url
        }/${storage?.name}`,
  };
};

export const useAllServerStorages = (
  projectId: string,
  availability: {
    isLocalZoneAvailable: boolean;
    is3azAvailable: boolean;
  },
) => {
  const { t } = useTranslation(['containers', 'containers/add']);
  const queryClient = useQueryClient();

  const { data, isLoading, isPending, isRefreshing, error } = useMappedStorages(
    projectId,
  );

  const getDeploymentModeLabel = useCallback(
    (storage: TStorage) => {
      const { deploymentMode } = storage;

      switch (deploymentMode) {
        case OBJECT_CONTAINER_MODE_MULTI_ZONES:
          return t(
            `pci_projects_project_storages_containers_deployment_mode_region-3-az`,
          );
        case OBJECT_CONTAINER_MODE_MONO_ZONE:
          return availability.isLocalZoneAvailable &&
            availability.is3azAvailable
            ? t(
                'pci_projects_project_storages_containers_deployment_mode_region',
              )
            : t(
                'containers/add:pci_projects_project_storages_containers_add_deployment_mode_flipping_region',
              );
        case OBJECT_CONTAINER_MODE_LOCAL_ZONE:
          return t(
            'pci_projects_project_storages_containers_deployment_mode_localzone',
          );
        default:
          return '';
      }
    },
    [t, availability.isLocalZoneAvailable, availability.is3azAvailable],
  );

  const mappedStorages = useMemo(() => {
    if (!data) return [];

    return data.map((storage) => ({
      ...storage,
      mode: getDeploymentModeLabel(storage),
    }));
  }, [data, getDeploymentModeLabel]);

  const allStorages = useMemo(
    () =>
      mappedStorages.filter(
        (element) =>
          element.s3StorageType &&
          element.deploymentMode !== OBJECT_CONTAINER_MODE_LOCAL_ZONE,
      ),
    [mappedStorages],
  );

  const refresh = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: getAllStoragesQueryKey(projectId),
      }),
    [projectId, queryClient],
  );

  return {
    isLoading,
    isPending,
    allStorages,
    error,
    isRefreshing,
    refresh,
  };
};
