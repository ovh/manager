import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { deleteDatastore, DatastoreProps } from '@/data/api/apiDatastore';

export interface DeleteMutateDatastoreProps {
  onError: (cause: AIError) => void;
  onSuccess: () => void;
}

export function useDeleteDatastore({
  onError,
  onSuccess,
}: DeleteMutateDatastoreProps) {
  const mutation = useMutation({
    mutationFn: (datastore: DatastoreProps) => {
      return deleteDatastore(datastore);
    },
    onError,
    onSuccess,
  });

  return {
    deleteDatastore: (datastore: DatastoreProps) => {
      return mutation.mutate(datastore);
    },
    ...mutation,
  };
}
