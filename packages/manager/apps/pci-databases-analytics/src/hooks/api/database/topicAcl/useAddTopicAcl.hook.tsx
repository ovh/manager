import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';
import { addTopicAcl, AddTopicAcl } from '@/data/api/database/topicAcl.api';

export interface UseAddTopicAcl {
  onError: (cause: CdbError) => void;
  onSuccess: (database: database.kafka.TopicAcl) => void;
}
export function useAddTopicAcl({
  onError,
  onSuccess: customOnSuccess,
}: UseAddTopicAcl) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (topicInfo: AddTopicAcl) => {
      return addTopicAcl(topicInfo);
    },
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'acl',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    addTopicAcl: (topicInfo: AddTopicAcl) => {
      return mutation.mutate(topicInfo);
    },
    ...mutation,
  };
}
