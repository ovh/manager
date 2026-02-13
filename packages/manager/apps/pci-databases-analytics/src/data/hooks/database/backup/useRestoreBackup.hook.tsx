import { useMutation } from '@tanstack/react-query';
import { RestoreBackup, restoreBackup } from '@/data/api/database/backup.api';
import { CdbError } from '@/data/api/database';

interface UseRestoreBackup {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useRestoreBackup({ onError, onSuccess }: UseRestoreBackup) {
  const mutation = useMutation({
    mutationFn: (backupInfo: RestoreBackup) => {
      return restoreBackup(backupInfo);
    },
    onError,
    onSuccess,
  });

  return {
    restoreBackup: (backupInfo: RestoreBackup) => {
      return mutation.mutate(backupInfo);
    },
    ...mutation,
  };
}
