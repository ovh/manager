import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { DeleteRegistryProps, deleteRegistry } from '@/data/api/apiRegistry';

export interface DeleteMutateRegistryProps {
  onError: (cause: AIError) => void;
  onSuccess: () => void;
}

export function useDeleteRegistry({
  onError,
  onSuccess,
}: DeleteMutateRegistryProps) {
  const mutation = useMutation({
    mutationFn: (registryId: DeleteRegistryProps) => {
      return deleteRegistry(registryId);
    },
    onError,
    onSuccess,
  });

  return {
    deleteRegistry: (registryId: DeleteRegistryProps) => {
      return mutation.mutate(registryId);
    },
    ...mutation,
  };
}
