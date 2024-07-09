import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { AddRegistryProps, addRegistry } from '@/data/api/apiRegistry';
import { ai } from '@/types/ai';

export interface AddEditMutateRegistryProps {
  onError: (cause: AIError) => void;
  onSuccess: (registry: ai.registry.Registry) => void;
}

export function useAddRegistry({
  onError,
  onSuccess,
}: AddEditMutateRegistryProps) {
  const mutation = useMutation({
    mutationFn: (registryInfo: AddRegistryProps) => {
      return addRegistry(registryInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addRegistry: (registryInfo: AddRegistryProps) => {
      return mutation.mutate(registryInfo);
    },
    ...mutation,
  };
}