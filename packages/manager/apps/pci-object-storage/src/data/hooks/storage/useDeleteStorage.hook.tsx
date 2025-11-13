import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import { ObjectStorageTypeEnum } from '@/types/Storages';
import {
  SwiftData,
  deleteSwiftStorage,
} from '@/data/api/storage/swiftStorage.api';
import { S3Data, deleteS3Storage } from '@/data/api/storage/s3Storage.api';

interface UseDeleteStorage {
  storageType: ObjectStorageTypeEnum;
  onError: (cause: ObjStoError) => void;
  onDeleteSuccess: () => void;
}

function isS3Data(data: S3Data | SwiftData): data is S3Data {
  return 'region' in data; // À adapter selon les propriétés uniques à S3Data
}

function isSwiftData(data: S3Data | SwiftData): data is SwiftData {
  return 'containerId' in data; // À adapter selon les propriétés uniques à SwiftData
}

export function useDeleteStorage({
  storageType,
  onError,
  onDeleteSuccess,
}: UseDeleteStorage) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (info: SwiftData | S3Data) => {
      if (storageType === ObjectStorageTypeEnum.s3 && isS3Data(info)) {
        return deleteS3Storage(info);
      }
      if (storageType === ObjectStorageTypeEnum.swift && isSwiftData(info)) {
        return deleteSwiftStorage(info);
      }
      throw new Error('Invalid Data');
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.projectId, 'storages'],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteStorage: (storageInfo: SwiftData | S3Data) => {
      return mutation.mutate(storageInfo);
    },
    ...mutation,
  };
}
