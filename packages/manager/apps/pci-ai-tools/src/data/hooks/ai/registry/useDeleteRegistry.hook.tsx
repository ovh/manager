import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import {
  DeleteRegistryProps,
  deleteRegistry,
} from '@/data/api/ai/registry/registry.api';

export interface DeleteMutateRegistryProps {
  onError: (cause: AIError) => void;
  onDeleteSuccess: () => void;
}

export function useDeleteRegistry({
  onError,
  onDeleteSuccess,
}: DeleteMutateRegistryProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (registryId: DeleteRegistryProps) => {
      return deleteRegistry(registryId);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'registry'],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteRegistry: (registryId: DeleteRegistryProps) => {
      return mutation.mutate(registryId);
    },
    ...mutation,
  };
}
