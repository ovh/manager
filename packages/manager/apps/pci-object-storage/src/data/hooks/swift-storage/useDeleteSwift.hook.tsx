import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import {
  SwiftData,
  deleteSwiftStorage,
} from '@/data/api/storage/swiftStorage.api';

interface UseDeleteSwift {
  onError: (cause: ObjStoError) => void;
  onDeleteSuccess: () => void;
}
export function useDeleteSwift({ onError, onDeleteSuccess }: UseDeleteSwift) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (info: SwiftData) => {
      return deleteSwiftStorage(info);
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
    deleteSwift: (storageInfo: SwiftData) => {
      return mutation.mutate(storageInfo);
    },
    ...mutation,
  };
}
