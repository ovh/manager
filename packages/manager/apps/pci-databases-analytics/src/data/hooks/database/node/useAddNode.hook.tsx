import { useMutation } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import { AddNode, addNode } from '@/data/api/database/node.api';
import * as database from '@/types/cloud/project/database';

interface UseAddNode {
  onError: (cause: CdbError) => void;
  onSuccess: (service: database.service.Node) => void;
}
export function useAddNode({ onError, onSuccess }: UseAddNode) {
  const mutation = useMutation({
    mutationFn: (nodeInfo: AddNode) => {
      return addNode(nodeInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addNode: (nodeInfo: AddNode) => {
      return mutation.mutate(nodeInfo);
    },
    ...mutation,
  };
}
