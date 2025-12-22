import { UseQueryResult } from '@tanstack/react-query';

/**
 * Used for queries that are aware of the backup services id,
 * and might need to show a loading state for the backupServicesId query.
 * Additionally, it could also be used to display backupServicesId related errors.
 */
export type BackupServiceAwareQuery<TData, TError = Error> = UseQueryResult<TData, TError> & {
  isLoadingBackupServicesId: boolean;
  backupServicesIdError?: Error;
};
