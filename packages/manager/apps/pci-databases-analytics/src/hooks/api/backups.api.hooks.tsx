import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import {
  RestoreBackupProps,
  getServiceBackups,
  restoreBackup,
} from '@/data/api/databases/backups';
import { CdbError } from '@/data/api/databases';
import { useQueryImmediateRefetch } from './useImmediateRefetch';

export function useGetBackups(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'backup'];
  return useQueryImmediateRefetch({
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
