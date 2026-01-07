import cloud from '@/types/Cloud';
import { mockedReplicationRule } from './replication';

export const mockedStorageContainer: cloud.StorageContainer = {
  createdAt: '2024-08-04',
  name: 'containerName',
  objects: [],
  objectsCount: 0,
  objectsSize: 0,
  ownerId: 3,
  region: 'BHS',
  virtualHost: 'virtualHost',
  versioning: {
    status: cloud.storage.VersioningStatusEnum.disabled,
  },
  objectLock: {
    status: cloud.storage.ObjectLockStatusEnum.disabled,
  },
  encryption: {
    sseAlgorithm: cloud.storage.EncryptionAlgorithmEnum.plaintext,
  },
};

export const mockedS3WithReplication: cloud.StorageContainer = {
  ...mockedStorageContainer,
  versioning: {
    status: cloud.storage.VersioningStatusEnum.enabled,
  },
  replication: {
    rules: [mockedReplicationRule],
  },
};
