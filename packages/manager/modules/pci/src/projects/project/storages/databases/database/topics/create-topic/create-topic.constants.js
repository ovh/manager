export const TOPICS_DEFAULT_VALUES = {
  replication: 3,
  partitions: 1,
  retentionBytes: -1,
  retentionHours: -1,
  minInsyncReplicas: 2,
  cleanupPolicy: 'default',
  status: 'READY',
};

export default {
  TOPICS_DEFAULT_VALUES,
};
