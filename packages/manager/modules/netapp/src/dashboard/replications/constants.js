export const ACCEPTED_REPLICATION_STATE = {
  ERROR: 'acceptedReplicationStateError',
  IN_SYNC: 'acceptedReplicationStateInSync',
  OUT_OF_SYNC: 'acceptedReplicationStateOutOfSync',
  ACTIVE: 'acceptedReplicationStateActive',
};

export const REPLICATION_API_STATUS = {
  accepted: 'accepted',
  pending: 'pending',
  cutover: 'cutover',
  completed: 'completed',
  error: 'error',
  deleting: 'deleting',
};

export const REPLICATION_API_REPLICASTATE = {
  error: 'error',
  in_sync: 'in_sync',
  out_of_sync: 'out_of_sync',
  // active: 'active',
};

export const REPLICATION_STATUS_DISPLAY = {
  pending: {
    color: 'warning',
    wording: 'pending',
  },
  cutover: {
    color: 'info',
    wording: 'cutover',
  },
  completed: {
    color: 'success',
    wording: 'completed',
  },
  error: {
    color: 'error',
    wording: 'error',
  },
  [ACCEPTED_REPLICATION_STATE.ERROR]: {
    color: 'error',
    wording: 'accepted_synch_error',
  },
  [ACCEPTED_REPLICATION_STATE.IN_SYNC]: {
    color: 'success',
    wording: 'accepted_synchronize',
  },
  [ACCEPTED_REPLICATION_STATE.OUT_OF_SYNC]: {
    color: 'info',
    wording: 'accepted_synchronizating',
  },
  // [ACCEPTED_REPLICATION_STATE.ACTIVE]: {
  //   color: 'info',
  //   wording: 'accepted_active',
  // },
  deleting: {
    color: 'warning',
    wording: 'deleting',
  },
};
