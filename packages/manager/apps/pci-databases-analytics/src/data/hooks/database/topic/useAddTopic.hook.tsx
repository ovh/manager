import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';
import { addTopic, AddTopic } from '@/data/api/database/topic.api';

export interface UseAddTopic {
  onError: (cause: CdbError) => void;
  onSuccess: (database: database.kafka.Topic) => void;
}
export function useAddTopic({
  onError,
  onSuccess: customOnSuccess,
}: UseAddTopic) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (topicInfo: AddTopic) => {
      return addTopic(topicInfo);
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
    addTopic: (topicInfo: AddTopic) => {
      return mutation.mutate(topicInfo);
    },
    ...mutation,
  };
}
