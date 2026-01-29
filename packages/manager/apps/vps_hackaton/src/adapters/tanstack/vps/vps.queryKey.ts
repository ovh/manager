import { queryKey } from '../queryKey';

export const vpsListQueryKey = () => ['vps', 'list'] as const;

export const vpsDetailQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['detail']);

export const vpsSnapshotQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['snapshot']);

export const vpsVeeamQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['veeam']);

export const vpsRestorePointsQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['veeam', 'restorePoints']);

export const vpsBackupStorageQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['backupStorage']);

export const vpsBackupStorageAclsQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['backupStorage', 'acls']);

export const vpsMonitoringQueryKey = (
  serviceName: string,
  period: string,
  type: string,
) => queryKey(serviceName, ['monitoring', period, type]);

export const vpsTasksQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['tasks']);

export const vpsImagesQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['images']);

export const vpsOptionsQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['options']);

export const vpsMigrationQueryKey = (serviceName: string) =>
  queryKey(serviceName, ['migration']);
