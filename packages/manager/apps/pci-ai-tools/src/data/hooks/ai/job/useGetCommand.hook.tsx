import { useMutation } from '@tanstack/react-query';
import ai from '@/types/AI';
import { AIError } from '@/data/api';
import { AddJob, getCommand } from '@/data/api/ai/job/job.api';

interface GetCommandProps {
  onError: (cause: AIError) => void;
  onSuccess: (notebook: ai.Command) => void;
}

export function useGetCommand({ onError, onSuccess }: GetCommandProps) {
  const mutation = useMutation({
    mutationFn: (jobInfo: AddJob) => {
      return getCommand(jobInfo);
    },
    onError,
    onSuccess,
  });

  return {
    getCommand: (jobInfo: AddJob) => {
      return mutation.mutate(jobInfo);
    },
    ...mutation,
  };
}
