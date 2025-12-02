import { REPLICATIONS_STATUS, ACCEPTED_REPLICATION_STATE } from './constants';

export default class OvhManagerNetAppReplicationsCtrl {
  /* @ngInject */
  constructor($translate, $http) {
    this.$translate = $translate;
    this.$http = $http;
    this.ongoingStatus = REPLICATIONS_STATUS.ONGOING;
    this.hasReplications = false;
  }

  $onInit() {
    this.hasReplications = !!Object.keys(this.replications).length;
  }

  canApprouve = (replicationStatus, destinationServiceID) =>
    replicationStatus === 'pending' &&
    this.serviceName === destinationServiceID;

  postAcceptReplication = (
    destinationServiceID,
    replicationID,
    sourceShareID,
  ) =>
    this.$http
      .get(`/storage/netapp/${destinationServiceID}/share/${sourceShareID}`)
      .then(({ data: { size } }) =>
        this.$http
          .post(
            `/storage/netapp/${destinationServiceID}/shareReplication/${replicationID}/accept`,
            {
              share: {
                protocol: 'NFS',
                size,
              },
            },
          )
          .then(({ data: { id } }) => {
            this.replication[this.ongoingStatus] = this.replication[
              this.ongoingStatus
            ].map((replication) => ({
              ...replication,
              ...(id === replication.source.shareID && {
                status: ACCEPTED_REPLICATION_STATE.IN_SYNC,
              }),
            }));
          }),
      );

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
