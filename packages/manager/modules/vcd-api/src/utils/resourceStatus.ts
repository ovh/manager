import { BackupResourceStatus, VCDResourceStatus } from '../types';

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

export const isStatusEnabled = (
  resourceStatus: BackupResourceStatus | VCDResourceStatus,
) => resourceStatus === 'READY';
