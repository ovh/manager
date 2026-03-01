import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DeleteDatabase,
  deleteDatabase,
} from '@/data/api/database/database.api';
import { CdbError } from '@/data/api/database';
import { DeleteTopic, deleteTopic } from '@/data/api/database/topic.api';

interface UseDeleteTopic {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteTopic({
  onError,
  onSuccess: customOnSuccess,
}: UseDeleteTopic) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (topicInfo: DeleteTopic) => {
      return deleteTopic(topicInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'topic',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deleteTopic: (topicInfo: DeleteTopic) => {
      return mutation.mutate(topicInfo);
    },
    ...mutation,
  };
}
