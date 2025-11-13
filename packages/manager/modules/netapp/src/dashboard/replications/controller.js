import { REPLICATIONS_STATUS } from './constants';

export default class OvhManagerNetAppReplicationsCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.ongoingStatus = REPLICATIONS_STATUS.ONGOING;
  }

  status = {
    pending: {
      color: 'warning',
      wording: 'pending',
    },
    replicating: {
      color: 'info',
      wording: 'replicating',
    },
    cutover: {
      color: 'info',
      wording: 'synchronized',
    },
    completed: {
      color: 'success',
      wording: 'synchronized',
    },
    accepted: {
      color: 'success',
      wording: 'accepted',
    },
    error: {
      color: 'error',
      wording: 'error',
    },
  };
}
