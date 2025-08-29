import {
  TSeverity,
  TStatus,
  TStatusSeverity,
} from '@/types/instance/common.type';

export const severityToStatus: Record<TSeverity, TStatus[]> = {
  warning: [
    'BUILDING',
    'REBOOT',
    'REBUILD',
    'REVERT_RESIZE',
    'SOFT_DELETED',
    'VERIFY_RESIZE',
    'MIGRATING',
    'RESIZE',
    'BUILD',
    'SHUTOFF',
    'RESCUE',
    'SHELVED',
    'SHELVED_OFFLOADED',
    'RESCUING',
    'UNRESCUING',
    'SNAPSHOTTING',
    'RESUMING',
    'HARD_REBOOT',
    'PASSWORD',
    'PAUSED',
  ],
  error: ['DELETED', 'ERROR', 'STOPPED', 'SUSPENDED', 'UNKNOWN'],
  success: ['ACTIVE', 'RESCUED', 'RESIZED'],
  info: [],
};

const getInstanceStatusSeverity = (status: TStatus): TSeverity => {
  const severities = Object.keys(severityToStatus) as TSeverity[];

  return (
    severities.find((severity) =>
      severityToStatus[severity].some((s) => s === status),
    ) ?? 'info'
  );
};

export const getInstanceStatus = (status: TStatus): TStatusSeverity => ({
  label: status,
  severity: getInstanceStatusSeverity(status),
});
