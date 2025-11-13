import { useMutation } from '@tanstack/react-query';
import { ContainerObjectTempURL } from '@datatr-ux/ovhcloud-types/cloud/storage/index';
import { ObjStoError } from '@/data/api';
import {
  DownloadSwiftData,
  downloadObject,
} from '@/data/api/storage/swiftStorage.api';

export interface UseDownloadSwiftObject {
  onError: (cause: ObjStoError) => void;
  onSuccess: (downloadInfo: ContainerObjectTempURL) => void;
}

export function useDownloadSwiftObject({
  onError,
  onSuccess: customOnSuccess,
}: UseDownloadSwiftObject) {
  const mutation = useMutation({
    mutationFn: (obectInfo: DownloadSwiftData) => {
      return downloadObject(obectInfo);
    },
    onError,
    onSuccess: (objectInfo) => {
      customOnSuccess(objectInfo);
    },
  });

  return {
    downloadSwiftObject: (obectInfo: DownloadSwiftData) => {
      return mutation.mutate(obectInfo);
    },
    ...mutation,
  };
}
