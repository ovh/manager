import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addHighPerfObjects,
  addObjects,
  addUser,
  deleteSwitchObject,
  deleteS3Object,
} from '@/api/data/objects';
import queryClient from '@/queryClient';
import { TStorage, getStorageAccess } from '../data/storages';

export const useAccessToken = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'access'],
    queryFn: () => getStorageAccess({ projectId }),
  });

export const deleteObject = async (
  projectId: string,
  storage: TStorage,
  objectName: string,
  region: string,
) => {
  if (storage.s3StorageType) {
    return deleteS3Object(
      projectId,
      storage.id,
      objectName,
      region,
      storage.s3StorageType,
    );
  }
  const response = await getStorageAccess({ projectId });
  return deleteSwitchObject(
    projectId,
    storage.name,
    objectName,
    response.token,
    region,
  );
};

type DeleteObjectProps = {
  projectId: string;
  storage: TStorage;
  objectName: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};
export const useDeleteObject = ({
  projectId,
  storage,
  objectName,
  region,
  onError,
  onSuccess,
}: DeleteObjectProps) => {
  const mutation = useMutation({
    mutationFn: async () => {
      await deleteObject(projectId, storage, objectName, region);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'objects'],
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
      /**
       * TODO: Should invalidate the objects fetch cache
       */
      onSuccess();
    },
  });

  return {
    addObjects: () => mutation.mutate(),
    ...mutation,
  };
};
