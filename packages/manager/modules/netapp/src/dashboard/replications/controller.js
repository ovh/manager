import {
  ACCEPTED_REPLICATION_STATE,
  REPLICATION_API_REPLICASTATE,
  REPLICATION_API_STATUS,
  REPLICATION_STATUS_DISPLAY,
} from './constants';

export default class OvhManagerNetAppReplicationsCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.hasReplications = false;
  }

  $onInit() {
    this.hasReplications = !!this.replications.length;
  }

  canApprouve(replication) {
    return (
      replication.status === REPLICATION_API_STATUS.pending &&
      this.serviceName === replication.destination.serviceID
    );
  }

  canPromote(replication) {
    return (
      replication.status === REPLICATION_API_STATUS.accepted &&
      replication.replicaState === REPLICATION_API_REPLICASTATE.in_sync &&
      this.serviceName === replication.destination.serviceID
    );
  }

  static canDelete(replication) {
    return [
      REPLICATION_API_STATUS.accepted,
      REPLICATION_API_STATUS.pending,
      REPLICATION_API_STATUS.completed,
    ].includes(replication.status);
  }

  deleteOrCancelLabel(replication) {
    if (
      [
        REPLICATION_API_STATUS.accepted,
        REPLICATION_API_STATUS.pending,
      ].includes(replication.status)
    ) {
      return this.$translate.instant('netapp_replications_button_cancel');
    }
    return this.$translate.instant('netapp_replications_button_delete');
  }

  static getStatus(replication) {
    if (replication.status === REPLICATION_API_STATUS.accepted) {
      if (replication.replicaState === REPLICATION_API_REPLICASTATE.error)
        return REPLICATION_STATUS_DISPLAY[ACCEPTED_REPLICATION_STATE.ERROR];
      if (replication.replicaState === REPLICATION_API_REPLICASTATE.in_sync)
        return REPLICATION_STATUS_DISPLAY[ACCEPTED_REPLICATION_STATE.IN_SYNC];
      if (replication.replicaState === REPLICATION_API_REPLICASTATE.out_of_sync)
        return REPLICATION_STATUS_DISPLAY[
          ACCEPTED_REPLICATION_STATE.OUT_OF_SYNC
        ];
      // if (replication.replicaState === REPLICATION_API_REPLICASTATE.active) return ACCEPTED_REPLICATION_STATE.ACTIVE;
    }

    return REPLICATION_STATUS_DISPLAY[replication.status];
  }
}
