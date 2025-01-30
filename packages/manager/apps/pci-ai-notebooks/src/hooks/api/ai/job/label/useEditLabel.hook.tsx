import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { EditLabelProps, editLabel } from '@/data/api/ai/job/label/label.api';

export interface MutateLabelProps {
  onError: (cause: AIError) => void;
  onSuccess: () => void;
}

export function useEditLabel({
  onError,
  onSuccess: customOnSuccess,
}: MutateLabelProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (labelInfo: EditLabelProps) => {
      return editLabel(labelInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.projectId, 'job', variables.jobId],
      });
      customOnSuccess();
    },
  });

  return {
    editLabel: (labelInfo: EditLabelProps) => {
      return mutation.mutate(labelInfo);
    },
    ...mutation,
  };
}
