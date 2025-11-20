import storages from '@/types/Storages';

export const mockedReplicationRule: storages.ReplicationRule = {
  id: 'rule1',
  priority: 1,
  status: storages.ReplicationRuleStatusEnum.enabled,
  deleteMarkerReplication:
    storages.ReplicationRuleDeleteMarkerReplicationStatusEnum.disabled,
  destination: {
    name: 'destination-bucket',
    region: 'SBG',
    storageClass: undefined,
  },
  filter: {
    prefix: 'images/',
    tags: {
      tag1: 'value1',
      tag2: 'value2',
    },
  },
};
