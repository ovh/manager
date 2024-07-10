import { useMutation } from '@tanstack/react-query';
import { AddEditMutateDatastoreProps } from './useAddDatastore';
import { EditDatastoreProps, editDatastore } from '@/data/api/apiDatastore';

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
