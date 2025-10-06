import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ObjStoError } from '@/data/api';
import {
  DeleteSwiftObjectData,
  deleteSwiftObject,
} from '@/data/api/storage/swiftStorage.api';

interface UseDeleteSwiftObject {
  onError: (cause: ObjStoError) => void;
  onDeleteSuccess: () => void;
}

export function useDeleteSwiftObject({
  onError,
  onDeleteSuccess,
}: UseDeleteSwiftObject) {
  const queryClient = useQueryClient();
  const { projectId, swiftId } = useParams();
  const mutation = useMutation({
    mutationFn: (objectInfo: DeleteSwiftObjectData) => {
      return deleteSwiftObject(objectInfo);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [projectId, 'storage', swiftId],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteSwiftObject: (objectInfo: DeleteSwiftObjectData) => {
      return mutation.mutate(objectInfo);
    },
    ...mutation,
  };
}
