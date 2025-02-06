import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import {
  DataSyncProps,
  dataSync,
} from '@/data/api/ai/job/datasync/datasync.api';

export interface MutateLabelProps {
  onError: (cause: AIError) => void;
  onSuccess: () => void;
}

export function useDataSync({ onError, onSuccess }: MutateLabelProps) {
  const mutation = useMutation({
    mutationFn: (dataSyncInfo: DataSyncProps) => {
      return dataSync(dataSyncInfo);
    },
    onError,
    onSuccess,
  });

  return {
    dataSync: (dataSyncInfo: DataSyncProps) => {
      return mutation.mutate(dataSyncInfo);
    },
    ...mutation,
  };
}
