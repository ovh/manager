import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
  useMutation,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import {
  RestoreBackupProps,
  getServiceBackups,
  restoreBackup,
} from '@/api/databases/backups';
import { CdbError } from '@/api/databases';

export function useGetBackups(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'backup'];
  return useQuery({
    queryKey,
    queryFn: () => getServiceBackups({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.Backup[], Error>;
}

interface MutateBackupProps {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useRestoreBackup({ onError, onSuccess }: MutateBackupProps) {
  const mutation = useMutation({
    mutationFn: (backupInfo: RestoreBackupProps) => {
      return restoreBackup(backupInfo);
    },
    onError,
    onSuccess,
  });

  return {
    restoreBackup: (backupInfo: RestoreBackupProps) => {
      return mutation.mutate(backupInfo);
    },
    ...mutation,
  };
}
