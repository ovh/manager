import { useMutation } from '@tanstack/react-query';
import { AddEditMutateRegistryProps } from './useAddRegistry';
import { EditRegistryProps, editRegistry } from '@/data/api/apiRegistry';

export function useEditRegistry({
  onError,
  onSuccess,
}: AddEditMutateRegistryProps) {
  const mutation = useMutation({
    mutationFn: (registryInfo: EditRegistryProps) => {
      return editRegistry(registryInfo);
    },
    onError,
    onSuccess,
  });

  return {
    editRegistry: (registryInfo: EditRegistryProps) => {
      return mutation.mutate(registryInfo);
    },
    ...mutation,
  };
}
