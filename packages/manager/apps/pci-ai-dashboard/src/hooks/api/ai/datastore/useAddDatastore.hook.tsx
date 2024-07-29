import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { AddDatastoreProps, addDatastore } from '@/data/api/ai/datastore.api';
import * as ai from '@/types/cloud/project/ai';

export interface AddEditMutateDatastoreProps {
  onError: (cause: AIError) => void;
  onSuccess: (datastore: ai.DataStore) => void;
}

export function useAddDatastore({
  onError,
  onSuccess,
}: AddEditMutateDatastoreProps) {
  const mutation = useMutation({
    mutationFn: (datastoreInfo: AddDatastoreProps) => {
      return addDatastore(datastoreInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addDatastore: (datastoreInfo: AddDatastoreProps) => {
      return mutation.mutate(datastoreInfo);
    },
    ...mutation,
  };
}
