import { ACCEPTED_REPLICATION_STATE } from './constants';

export default class OvhManagerNetAppReplicationsCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.hasReplications = false;
  }

  $onInit() {
    this.hasReplications = !!this.replications.length;
  }

  status = {
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
    deleting: {
      color: 'warning',
      wording: 'deleting',
    },
  };
}
