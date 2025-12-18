import { appName } from '@/App.constants';

const ROOT_URL = `/`;

export const subRoutes = {
  onboarding: 'onboarding' as const,
  listing: 'listing' as const,
  order: 'order' as const,
  dashboard: ':serviceName' as const,
  editName: 'edit-name' as const,
  partitions: 'partitions' as const,
  partitionsCreate: 'create' as const,
  partitionsDelete: ':partitionName/delete' as const,
  partitionsEditSize: ':partitionName/edit-size' as const,
  partitionsZfsOptions: ':partitionName/zfs-options' as const,
  partition: 'partition/:partitionName' as const,
  partitionEditDescription: 'edit-description' as const,
  partitionEditSize: 'edit-size' as const,
  partitionAccesses: 'accesses' as const,
  partitionAccessDelete: ':ip/delete' as const,
  partitionSnapshots: 'snapshots' as const,
  partitionSnapshotDelete: ':customSnapshotName/delete' as const,
} as const;

export const urls = {
  root: ROOT_URL,
  onboarding: `${ROOT_URL}${subRoutes.onboarding}`,
  listing: `${ROOT_URL}${subRoutes.listing}`,
  order: `${ROOT_URL}${subRoutes.order}`,
  dashboard: (serviceName: string) => `${ROOT_URL}${serviceName}`,
  editName: (serviceName: string) => `${ROOT_URL}${serviceName}/edit-name`,
  partitions: (serviceName: string) => `${ROOT_URL}${serviceName}/partitions`,
  partitionsCreate: (serviceName: string) =>
    `${ROOT_URL}${serviceName}/partitions/create`,
  partitionsDelete: (serviceName: string, partitionName: string) =>
    `${ROOT_URL}${serviceName}/partitions/${partitionName}/delete`,
  partitionsEditSize: (serviceName: string, partitionName: string) =>
    `${ROOT_URL}${serviceName}/partitions/${partitionName}/edit-size`,
  partitionsZfsOptions: (serviceName: string, partitionName: string) =>
    `${ROOT_URL}${serviceName}/partitions/${partitionName}/zfs-options`,
  partition: (serviceName: string, partitionName: string) =>
    `${ROOT_URL}${serviceName}/partition/${partitionName}`,
  partitionEditDescription: (serviceName: string, partitionName: string) =>
    `${ROOT_URL}${serviceName}/partition/${partitionName}/edit-description`,
  partitionEditSize: (serviceName: string, partitionName: string) =>
    `${ROOT_URL}${serviceName}/partition/${partitionName}/edit-size`,
  partitionAccesses: (serviceName: string, partitionName: string) =>
    `${ROOT_URL}${serviceName}/partition/${partitionName}/accesses`,
  partitionAccessDelete: (serviceName: string, partitionName: string, ip: string) =>
    `${ROOT_URL}${serviceName}/partition/${partitionName}/accesses/${encodeURIComponent(ip)}/delete`,
  partitionSnapshots: (serviceName: string, partitionName: string) =>
    `${ROOT_URL}${serviceName}/partition/${partitionName}/snapshots`,
  partitionSnapshotDelete: (
    serviceName: string,
    partitionName: string,
    customSnapshotName: string,
  ) =>
    `${ROOT_URL}${serviceName}/partition/${partitionName}/snapshots/${encodeURIComponent(customSnapshotName)}/delete`,
} as const;

export const redirectionApp = appName;
