import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addHighPerfObjects,
  addObjects,
  addUser,
  deleteSwiftObject,
  deleteS3Object,
} from '@/api/data/objects';
import queryClient from '@/queryClient';
import { TStorage, getStorageAccess } from '../data/storages';
import { getAllStoragesQueryKey } from './useStorages';
import { getContainerQueryKey } from './useContainer';

export const useAccessToken = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'access'],
    queryFn: () => getStorageAccess({ projectId }),
  });

type DeleteObjectProps = {
  projectId: string;
  storage: TStorage;
  objectName: string;
  versionId?: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteObject = ({
  projectId,
  storage,
  objectName,
  region,
  versionId,
  onError,
  onSuccess,
}: DeleteObjectProps) => {
  const mutation = useMutation({
    mutationFn: async () => {
      if (storage.s3StorageType) {
        return deleteS3Object({
          projectId,
          containerId: storage.name,
          objectName,
          containerRegion: region,
          s3StorageType: storage.s3StorageType,
          versionId,
        });
      }

      const { endpoints, token } = await getStorageAccess({ projectId });
      const url = endpoints?.find(
        ({ region: endpointRegion }) => endpointRegion === region,
      )?.url;
      return deleteSwiftObject({
        storageName: storage.name,
        objectName,
        token,
        url,
      });
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllStoragesQueryKey(projectId),
      });

      queryClient.invalidateQueries({
        queryKey: getContainerQueryKey({
          projectId,
          region,
          containerId: storage?.id,
          containerName: storage?.name,
        }),
      });

      onSuccess();
    },
  });
  return {
    deleteObject: () => mutation.mutate(),
    ...mutation,
  };
};

type AddUserProps = {
  projectId: string;
  storageId: string;
  objectName: string;
  region: string;
  userId: number;
  role: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAddUser = ({
  projectId,
  storageId,
  objectName,
  region,
  userId,
  role,
  onError,
  onSuccess,
}: AddUserProps) => {
  const mutation = useMutation({
    mutationFn: async () =>
      addUser({
        projectId,
        region,
        objectName,
        storageId,
        userId,
        role,
      }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'objects'],
      });
      onSuccess();
    },
  });
  return {
    addUser: () => mutation.mutate(),
    ...mutation,
  };
};

type AddObjectsProps = {
  projectId: string;
  container: TStorage;
  prefix: string;
  files: File[];
  storageClass: string;
  onError?: (cause: Error) => void;
  onSuccess?: () => void;
};

export const useAddObjects = ({
  projectId,
  container,
  prefix,
  files,
  storageClass,
  onSuccess,
  onError,
}: AddObjectsProps) => {
  const addPromise = container?.s3StorageType
    ? () =>
        addHighPerfObjects(
          projectId,
          container?.region,
          container?.name,
          prefix,
          files,
          container?.s3StorageType,
          storageClass,
        )
    : () => addObjects(projectId, container, prefix, files);

  const mutation = useMutation({
    mutationFn: addPromise,
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAllStoragesQueryKey(projectId),
      });

      queryClient.invalidateQueries({
        queryKey: getContainerQueryKey({
          projectId,
          region: container?.region,
          containerId: container?.id,
          containerName: container?.name,
        }),
      });

      onSuccess();
    },
  });

  return {
    addObjects: () => mutation.mutate(),
    ...mutation,
  };
};
