type ResourceStatus = 'READY' | 'CREATING' | 'UPDATING';

export type BackupResourceStatus =
  | ResourceStatus
  | 'DISABLED'
  | 'DISABLING'
  | 'REMOVED'
  | 'REMOVING';

export type VCDResourceStatus =
  | ResourceStatus
  | 'DELETING'
  | 'ERROR'
  | 'SUSPENDED';

export const isStatusTerminated = (
  resourceStatus: BackupResourceStatus | VCDResourceStatus,
) =>
  [
    'DISABLED',
    'DISABLING',
    'REMOVED',
    'REMOVING',
    'SUSPENDED',
    'DELETING',
  ].includes(resourceStatus);
