export const ROUTES = {
  ROOT: '/',
  VPS_LIST: '/',
  VPS_DETAIL: '/:serviceName',
  DASHBOARD: '',
  SNAPSHOT: 'snapshot',
  VEEAM: 'veeam',
  BACKUP_STORAGE: 'backup-storage',
  MONITORING: 'monitoring',
  MIGRATION: 'migration',
} as const;

export const getVpsDetailUrl = (serviceName: string): string =>
  `/${encodeURIComponent(serviceName)}`;

export const getSnapshotUrl = (serviceName: string): string =>
  `/${encodeURIComponent(serviceName)}/snapshot`;

export const getVeeamUrl = (serviceName: string): string =>
  `/${encodeURIComponent(serviceName)}/veeam`;

export const getBackupStorageUrl = (serviceName: string): string =>
  `/${encodeURIComponent(serviceName)}/backup-storage`;

export const getMonitoringUrl = (serviceName: string): string =>
  `/${encodeURIComponent(serviceName)}/monitoring`;

export const getMigrationUrl = (serviceName: string): string =>
  `/${encodeURIComponent(serviceName)}/migration`;
