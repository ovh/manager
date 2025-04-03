import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import {
  deleteDatastore,
  DatastoreProps,
} from '@/data/api/ai/data/datastore.api';

export interface DeleteMutateDatastoreProps {
  onError: (cause: AIError) => void;
  onDeleteSuccess: () => void;
}

export function useDeleteDatastore({
  onError,
  onDeleteSuccess,
}: DeleteMutateDatastoreProps) {
  const queryClient = useQueryClient();
  const { projectId, region } = useParams();
  const mutation = useMutation({
    mutationFn: (datastore: DatastoreProps) => {
      return deleteDatastore(datastore);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai/data/region', region],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteDatastore: (datastore: DatastoreProps) => {
      return mutation.mutate(datastore);
    },
    ...mutation,
  };
}
