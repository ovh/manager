export const RESTORE_MODES = {
  SOONEST: 'soonest',
  TIMESTAMP: 'timestamp',
  BACKUP: 'backup',
};

export const ORDER_KEYS = [
  'description',
  'nodesPattern.flavor',
  'nodesPattern.number',
  'nodesPattern.region',
  'plan',
  'version',
  'disk.size',
  'networkId',
  'subnetId',
  'forkFrom.serviceId',
  'forkFrom.backupId',
  'forkFrom.pointInTime',
];

export default {
  RESTORE_MODES,
  ORDER_KEYS,
};
