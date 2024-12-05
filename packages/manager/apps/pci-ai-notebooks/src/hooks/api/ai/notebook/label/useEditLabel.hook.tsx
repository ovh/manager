import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError } from '@/data/api';
import {
  EditLabelProps,
  editLabel,
} from '@/data/api/ai/notebook/label/label.api';

export interface MutateLabelProps {
  onError: (cause: AIError) => void;
  onEditSuccess: () => void;
}

export function useEditLabel({ onError, onEditSuccess }: MutateLabelProps) {
  const queryClient = useQueryClient();
  const { projectId, notebookId } = useParams();
  const mutation = useMutation({
    mutationFn: (labelInfo: EditLabelProps) => {
      return editLabel(labelInfo);
    },
    onError,
    onSuccess: () => {
      // Invalidate service list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai/notebook', notebookId],
      });
      onEditSuccess();
    },
  });

  return {
    editLabel: (labelInfo: EditLabelProps) => {
      return mutation.mutate(labelInfo);
    },
    ...mutation,
  };
}
