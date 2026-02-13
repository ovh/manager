import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';
import { editTopic, EditTopic } from '@/data/api/database/topic.api';

export interface UseEditTopic {
  onError: (cause: CdbError) => void;
  onSuccess: (database: database.kafka.Topic) => void;
}
export function useEditTopic({
  onError,
  onSuccess: customOnSuccess,
}: UseEditTopic) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (topicInfo: EditTopic) => {
      return editTopic(topicInfo);
    },
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'topic',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    editTopic: (topicInfo: EditTopic) => {
      return mutation.mutate(topicInfo);
    },
    ...mutation,
  };
}
