import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError } from '@/data/api';
import { AddRegistryProps, addRegistry } from '@/data/api/ai/registry.api';
import * as ai from '@/types/cloud/project/ai';

export interface AddEditMutateRegistryProps {
  onError: (cause: AIError) => void;
  onAddSuccess: (registry: ai.registry.Registry) => void;
}

export function useAddRegistry({
  onError,
  onAddSuccess,
}: AddEditMutateRegistryProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (registryInfo: AddRegistryProps) => {
      return addRegistry(registryInfo);
    },
    onError,
    onSuccess: (registry) => {
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'registry'],
      });
      onAddSuccess(registry);
    },
  });

  return {
    addRegistry: (registryInfo: AddRegistryProps) => {
      return mutation.mutate(registryInfo);
    },
    ...mutation,
  };
}
