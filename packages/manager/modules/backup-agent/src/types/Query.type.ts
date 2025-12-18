import { UseQueryResult } from '@tanstack/react-query';

/**
 * Used for queries that are aware of the backup services id
 * And might need to show a loading state for the backupServicesId query
 */
export type BackupServiceAwareQuery<TData, TError = Error> = UseQueryResult<TData, TError> & {
  isLoadingBackupServicesId?: boolean;
};
