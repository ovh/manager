import cloud from '@/types/Cloud';

export const mockedReplicationRule: cloud.storage.ReplicationRule = {
  id: 'rule-1',
  priority: 1,
  status: cloud.storage.ReplicationRuleStatusEnum.enabled,
  deleteMarkerReplication:
    cloud.storage.ReplicationRuleDeleteMarkerReplicationStatusEnum.enabled,
  destination: {
    name: 'destination-bucket',
    region: 'GRA',
    storageClass: cloud.storage.StorageClassEnum.STANDARD,
  },
  filter: {
    prefix: 'photos/',
  },
};
