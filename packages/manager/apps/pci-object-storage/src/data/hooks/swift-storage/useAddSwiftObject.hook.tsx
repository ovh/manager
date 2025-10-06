import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ObjStoError } from '@/data/api';
import {
  AddSwiftObjectData,
  addSwiftObject,
} from '@/data/api/storage/swiftStorage.api';

export interface UseAddSwiftObject {
  onError: (cause: ObjStoError) => void;
  onAddSuccess: () => void;
}

export function useAddSwiftObject({
  onError,
  onAddSuccess,
}: UseAddSwiftObject) {
  const queryClient = useQueryClient();
  const { projectId, swiftId } = useParams();
  const mutation = useMutation({
    mutationFn: (obectInfo: AddSwiftObjectData) => {
      return addSwiftObject(obectInfo);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [projectId, 'storage', swiftId, { noObjects: false }],
      });
      onAddSuccess();
    },
  });

  return {
    addSwiftObject: (obectInfo: AddSwiftObjectData) => {
      return mutation.mutate(obectInfo);
    },
    ...mutation,
  };
}
