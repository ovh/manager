import { useMutation, useQuery } from '@tanstack/react-query';
import {
  deleteObject,
  deleteS3Object,
  getAccessToken,
} from '@/api/data/objects';
import queryClient from '@/queryClient';
import { TStorage } from '../data/storages';

export const useAccessToken = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'access'],
    queryFn: () => getAccessToken(projectId),
  });

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
      if (storage.s3StorageType) {
        deleteS3Object(
          projectId,
          storage.id,
          objectName,
          region,
          storage.s3StorageType,
        );
      } else {
        const response = await getAccessToken(projectId);
        deleteObject(
          projectId,
          storage.name,
          objectName,
          response.token,
          region,
        );
      }
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
