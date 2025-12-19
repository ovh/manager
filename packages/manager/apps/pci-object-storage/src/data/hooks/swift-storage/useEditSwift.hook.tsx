import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import {
  EditSwiftData,
  editSwiftStorage,
} from '@/data/api/storage/swiftStorage.api';

interface UseEditSwift {
  onError: (cause: ObjStoError) => void;
  onSuccess: () => void;
}
export function useEditSwift({
  onError,
  onSuccess: customOnSuccess,
}: UseEditSwift) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (storageInfo: EditSwiftData) => {
      return editSwiftStorage(storageInfo);
    },
    onError,
    onSuccess: (storageInfo, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.projectId, 'storages'],
      });
      customOnSuccess();
    },
  });

  return {
    editSwift: (storageInfo: EditSwiftData) => {
      return mutation.mutate(storageInfo);
    },
    ...mutation,
  };
}
