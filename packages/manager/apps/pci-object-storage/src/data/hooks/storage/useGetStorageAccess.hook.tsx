import { useMutation } from '@tanstack/react-query';
import { ObjStoError, PCIData } from '@/data/api';
import storages from '@/types/Storages';
import { getStorageAccess } from '@/data/api/storage/storages.api';

export interface UseStorageAccess {
  onError: (cause: ObjStoError) => void;
  onSuccess: (access: storages.ContainerAccess) => void;
}

export function useGetStorageAccess({
  onError,
  onSuccess: customOnSuccess,
}: UseStorageAccess) {
  const mutation = useMutation({
    mutationFn: (storageInfo: PCIData) => {
      return getStorageAccess(storageInfo);
    },
    onError,
    onSuccess: (accessInfo) => {
      customOnSuccess(accessInfo);
    },
  });

  return {
    getStorageAccess: (storageInfo: PCIData) => {
      return mutation.mutate(storageInfo);
    },
    ...mutation,
  };
}
