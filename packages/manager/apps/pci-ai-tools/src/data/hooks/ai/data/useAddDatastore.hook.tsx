import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { AIError } from '@/data/api';
import {
  AddDatastoreProps,
  addDatastore,
} from '@/data/api/ai/data/datastore.api';

export interface AddEditMutateDatastoreProps {
  onError: (cause: AIError) => void;
  onAddSuccess: (datastore: ai.DataStore) => void;
}

export function useAddDatastore({
  onError,
  onAddSuccess,
}: AddEditMutateDatastoreProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (datastoreInfo: AddDatastoreProps) => {
      return addDatastore(datastoreInfo);
    },
    onError,
    onSuccess: (datastoreInfo) => {
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai/data/region'],
      });
      onAddSuccess(datastoreInfo);
    },
  });

  return {
    addDatastore: (datastoreInfo: AddDatastoreProps) => {
      return mutation.mutate(datastoreInfo);
    },
    ...mutation,
  };
}
