import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, JobData } from '@/data/api';
import { deleteJob } from '@/data/api/ai/job/job.api';

interface UseDeleteJob {
  onError: (cause: AIError) => void;
  onDeleteSuccess: () => void;
}

export function useDeleteJob({ onError, onDeleteSuccess }: UseDeleteJob) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (jobInfo: JobData) => {
      return deleteJob(jobInfo);
    },
    onError,
    onSuccess: () => {
      // Invalidate notebooks list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'job'],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteJob: (jobInfo: JobData) => {
      return mutation.mutate(jobInfo);
    },
    ...mutation,
  };
}
