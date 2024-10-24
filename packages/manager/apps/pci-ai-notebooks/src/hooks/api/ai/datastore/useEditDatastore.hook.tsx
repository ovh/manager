import { useMutation } from '@tanstack/react-query';
import { AddEditMutateDatastoreProps } from './useAddDatastore.hook';
import { EditDatastoreProps, editDatastore } from '@/data/api/ai/datastore.api';

export function useEditDatastore({
  onError,
  onSuccess,
}: AddEditMutateDatastoreProps) {
  const mutation = useMutation({
    mutationFn: (datastoreInfo: EditDatastoreProps) => {
      return editDatastore(datastoreInfo);
    },
    onError,
    onSuccess,
  });

  return {
    editDatastore: (datastoreInfo: EditDatastoreProps) => {
      return mutation.mutate(datastoreInfo);
    },
    ...mutation,
  };
}
