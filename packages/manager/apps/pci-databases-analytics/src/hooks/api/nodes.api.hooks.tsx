import { useMutation } from '@tanstack/react-query';
import { CdbError } from '@/api/databases';
import {
  AddNodeProps,
  DeleteNodeProps,
  addNode,
  deleteNode,
} from '@/api/databases/nodes';
import { database } from '@/models/database';

interface MutateNodeProps {
  onError: (cause: CdbError) => void;
  onSuccess: (service: database.service.Node) => void;
}
export function useAddNode({ onError, onSuccess }: MutateNodeProps) {
  const mutation = useMutation({
    mutationFn: (nodeInfo: AddNodeProps) => {
      return addNode(nodeInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addNode: (nodeInfo: AddNodeProps) => {
      return mutation.mutate(nodeInfo);
    },
    ...mutation,
  };
}
interface UseDeleteNodeProps {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}

export function useDeleteNode({ onError, onSuccess }: UseDeleteNodeProps) {
  const mutation = useMutation({
    mutationFn: (nodeInfo: DeleteNodeProps) => {
      return deleteNode(nodeInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteNode: (nodeInfo: DeleteNodeProps) => {
      return mutation.mutate(nodeInfo);
    },
    ...mutation,
  };
}
