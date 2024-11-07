import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import {
  EditLabelProps,
  editLabel,
} from '@/data/api/ai/notebook/label/label.api';

export interface MutateLabelProps {
  onError: (cause: AIError) => void;
  onSuccess: () => void;
}

export function useEditLabel({ onError, onSuccess }: MutateLabelProps) {
  const mutation = useMutation({
    mutationFn: (labelInfo: EditLabelProps) => {
      return editLabel(labelInfo);
    },
    onError,
    onSuccess,
  });

  return {
    editLabel: (labelInfo: EditLabelProps) => {
      return mutation.mutate(labelInfo);
    },
    ...mutation,
  };
}
