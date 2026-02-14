import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import {
  deleteTopicAcl,
  DeleteTopicAcl,
} from '@/data/api/database/topicAcl.api';

interface UseDeleteTopicAcl {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteTopicAcl({
  onError,
  onSuccess: customOnSuccess,
}: UseDeleteTopicAcl) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (topicInfo: DeleteTopicAcl) => {
      return deleteTopicAcl(topicInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'acl',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deleteTopicAcl: (topicInfo: DeleteTopicAcl) => {
      return mutation.mutate(topicInfo);
    },
    ...mutation,
  };
}
