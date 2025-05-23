import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ai from '@/types/AI';
import { AIError } from '@/data/api';
import { addJob } from '@/data/api/ai/job/job.api';

interface AddJobProps {
  onError: (cause: AIError) => void;
  onSuccess: (job: ai.job.Job) => void;
}

export function useAddJob({ onError, onSuccess }: AddJobProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (jobInfo: ai.job.JobSpecInput) => {
      return addJob({ projectId, jobInfo });
    },
    onError,
    onSuccess: (data) => {
      // invalidate notebook list to avoid displaying
      // old list
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'job'],
        refetchType: 'none',
      });
      onSuccess(data);
    },
  });

  return {
    addJob: (jobInfo: ai.job.JobSpecInput) => {
      return mutation.mutate(jobInfo);
    },
    ...mutation,
  };
}
