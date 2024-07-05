import { useMutation } from '@tanstack/react-query';
import { DeleteNode, deleteNode } from '@/data/api/database/node.api';
import { CdbError } from '@/data/api/database';

export interface UseDeleteNodeProps {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}

export function useDeleteNode({ onError, onSuccess }: UseDeleteNodeProps) {
  const mutation = useMutation({
    mutationFn: (nodeInfo: DeleteNode) => {
      return deleteNode(nodeInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteNode: (nodeInfo: DeleteNode) => {
      return mutation.mutate(nodeInfo);
    },
    ...mutation,
  };
}
