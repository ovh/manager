import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import {
  CreateSwiftData,
  createSwiftStorage,
} from '@/data/api/storage/swiftStorage.api';
import storages from '@/types/Storages';

interface UseCreateSwift {
  onError: (cause: ObjStoError) => void;
  onSuccess: (swiftContainer: storages.Container) => void;
}
export function useCreateSwift({
  onError,
  onSuccess: customOnSuccess,
}: UseCreateSwift) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (storageInfo: CreateSwiftData) => {
      return createSwiftStorage(storageInfo);
    },
    onError,
    onSuccess: (swiftContainer, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.projectId, 'storages'],
      });
      customOnSuccess(swiftContainer);
    },
  });

  return {
    createSwift: (storageInfo: CreateSwiftData) => {
      return mutation.mutate(storageInfo);
    },
    ...mutation,
  };
}
