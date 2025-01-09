import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { ApiError, applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useGetProjectRegions } from '@ovh-ux/manager-pci-common';
import {
  deleteContainer,
  deleteS3Container,
  getStorages,
  TStorage,
  getStorage,
  updateStorage,
  createSwiftStorage,
  createS3Storage,
  setContainerAsStatic,
  setContainerAsPublic,
} from '../data/storages';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
  OBJECT_CONTAINER_TYPE_PUBLIC,
  OBJECT_CONTAINER_TYPE_STATIC,
} from '@/constants';
import { paginateResults } from '@/helpers';
import { addUser } from '../data/objects';

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

export const useMappedStorages = (projectId: string) => {
  const { i18n, t } = useTranslation('pci-storages-containers');

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
          storedObjects: storage.storedObjects || 0,
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
  const { i18n, t } = useTranslation('pci-storages-containers');
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
          queryKey: getStorageQueryKey(projectId),
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

export interface UseDeleteStorageProps {
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
    mutationFn: async (storage: TStorage) => {
      if (storage.s3StorageType) {
        return deleteS3Container(
          projectId,
          storage.region,
          storage.s3StorageType,
          storage.name,
        );
      }
      return deleteContainer(projectId, storage.id);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getStorageQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    deleteStorage(storage: TStorage) {
      return mutation.mutate(storage);
    },
    ...mutation,
  };
};

export const useStorage = (
  projectId: string,
  region: string,
  storageId: string,
) => {
  const {
    data: storages,
    error: errorStorages,
    isPending: isStoragesPending,
  } = useAllStorages(projectId);

  const storage = storages?.resources.find(
    (s) => s.id === storageId || s.name === storageId,
  );

  const { data, error: errorStorage, isPending: isPendingStorage } = useQuery({
    queryKey: [...getStorageQueryKey(projectId), storageId],
    enabled: !!storage,
    queryFn: () =>
      getStorage(projectId, region, storage.s3StorageType, storageId),
  });

  return useMemo(() => {
    return {
      isPending: isStoragesPending || isPendingStorage,
      storage: data,
      error: errorStorages || errorStorage,
      storages,
    };
  }, [isPendingStorage, isStoragesPending, storage, data, storages]);
};

export interface UseUpdateStorageProps {
  projectId: string;
  region: string;
  name: string;
  s3StorageType: string;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}

export const useUpdateStorage = ({
  projectId,
  region,
  name,
  s3StorageType,
  onSuccess,
  onError,
}: UseUpdateStorageProps) => {
  const mutation = useMutation({
    mutationFn: async ({ versioning }: { versioning: { status: string } }) =>
      updateStorage({
        projectId,
        region,
        name,
        versioning,
        s3StorageType,
      }),
    onError,
    onSuccess,
  });

  return {
    updateContainer: ({ versioning }: { versioning: { status: string } }) =>
      mutation.mutate({ versioning }),
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
        queryKey: getStorageQueryKey(projectId),
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
  userId: string;
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
        queryKey: getStorageQueryKey(projectId),
      });
      onSuccess();
    },
  });

  return {
    addUser: () => mutation.mutate(),
    ...mutation,
  };
};
