export const NASHA_TITLE = 'NAS-HA';
export const NASHA_USE_SIZE_NAME = 'size';
export const NASHA_ALERT_ID = 'nasha_alert';

export const NASHA_TASK = {
  operation: {
    Create: 'clusterLeclercPartitionAdd',
    CustomSnapshotCreate: 'clusterLeclercCustomSnapCreate',
    CustomSnapshotDelete: 'clusterLeclercCustomSnapDelete',
    Delete: 'clusterLeclercPartitionDelete',
    SnapshotUpdate: 'clusterLeclercSnapshotUpdate',
    Update: 'clusterLeclercPartitionUpdate',
    ZfsOptions: 'clusterLeclercZfsOptions',
  },
  status: {
    Doing: 'doing',
    Todo: 'todo',
  },
};

export default {
  NASHA_ALERT_ID,
  NASHA_TASK,
  NASHA_TITLE,
  NASHA_USE_SIZE_NAME,
};
