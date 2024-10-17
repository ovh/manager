import { useMutation } from '@tanstack/react-query';
import { AddEditMutateRegistryProps } from './useAddRegistry.hook';
import { EditRegistryProps, editRegistry } from '@/data/api/ai/registry.api';

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
