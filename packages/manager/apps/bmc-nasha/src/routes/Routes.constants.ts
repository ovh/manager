import { APP_FEATURES, appName } from '@/App.constants';

import { getRoot } from './Routes.utils';

export const urls = {
  root: getRoot(),
  listing: 'listing',
  onboarding: 'onboarding',
  order: 'order',
  dashboard: 'dashboard/:serviceName',
  dashboardEditName: 'dashboard/:serviceName/edit-name',
  partitions: 'dashboard/:serviceName/partitions',
  partitionCreate: 'dashboard/:serviceName/partitions/create',
  partitionDetail: 'dashboard/:serviceName/partition/:partitionName',
  partitionEditDescription: 'dashboard/:serviceName/partition/:partitionName/edit-description',
  partitionEditSize: 'dashboard/:serviceName/partition/:partitionName/edit-size',
  partitionAccesses: 'dashboard/:serviceName/partition/:partitionName/accesses',
  partitionAccessDelete: 'dashboard/:serviceName/partition/:partitionName/accesses/delete/:ip',
  partitionSnapshots: 'dashboard/:serviceName/partition/:partitionName/snapshots',
  partitionSnapshotDelete:
    'dashboard/:serviceName/partition/:partitionName/snapshots/delete/:customSnapshotName',
  partitionsDelete: 'dashboard/:serviceName/partitions/:partitionName/delete',
  partitionsEditSize: 'dashboard/:serviceName/partitions/:partitionName/edit-size',
  partitionsZfsOptions: 'dashboard/:serviceName/partitions/:partitionName/zfs-options',
} as const;

export const redirectionApp = APP_FEATURES.isPci
  ? APP_FEATURES.appSlug // for PCI, shell expects the short app slug
  : appName;
