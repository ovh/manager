import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, JobData } from '@/data/api';
import { killJob } from '@/data/api/ai/job/job.api';

interface UsekillJob {
  onError: (cause: AIError) => void;
  onStopSuccess: () => void;
}

export function useKillJob({ onError, onStopSuccess }: UsekillJob) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (jobInfo: JobData) => {
      return killJob(jobInfo);
    },
    onError,
    onSuccess: () => {
      // Invalidate jobs list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'job'],
      });
      onStopSuccess();
    },
  });

  return {
    killJob: (jobInfo: JobData) => {
      return mutation.mutate(jobInfo);
    },
    ...mutation,
  };
}
