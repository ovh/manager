import { UseQueryResult } from '@tanstack/react-query';

/**
 * Used for queries that are aware of the backup services id
 * isFullyLoaded: !backupServicesIdQuery.isPending && !isPending
 */
export type BackupServiceAwareQuery<TData, TError = Error> = UseQueryResult<TData, TError> & {
  isFullyLoaded: boolean;
  isLoadingBackupServicesId?: boolean;
};
