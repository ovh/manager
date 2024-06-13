import { FETCH_INTERVAL, SNAPSHOT_STATUS, SNAPSHOT_TYPE } from "./constants";

export default class NetAppRestoreVolumeService {
  /* @ngInject */
  constructor($http, $q, iceberg, Poller) {
    this.$http = $http;
    this.$q = $q;
    this.iceberg = iceberg;
    this.Poller = Poller;
  }

  restoreVolume(serviceName, volumeId, snapshot) {
    if (snapshot.type === SNAPSHOT_TYPE.MANUAL) {
      return this.revertVolume(serviceName, volumeId, snapshot.id);
    }

    if (snapshot.type === SNAPSHOT_TYPE.AUTOMATIC) {
      return this.holdSnapshot(serviceName, volumeId, snapshot.id)
        .then(({data}) => {
          return this.startSnapshotPolling(serviceName, volumeId, data.id)
            .then((data) => {
              console.log("POLLING", data);
              return this.revertVolume(serviceName, volumeId, data.id);
            });
        })
    }
  }

  holdSnapshot(serviceName, volumeId, snapshotId) {
    return this.$http.post(`/storage/netapp/${serviceName}/share/${volumeId}/snapshot/${snapshotId}/hold`);
  }

  revertVolume(serviceName, volumeId, snapshotID) {
    return this.$http.post(`/storage/netapp/${serviceName}/share/${volumeId}/revert`, {
      snapshotID
    });
  }

  // POLLING MANAGEMENT FUNCTIONS
  /**
   * Polling on snapshot satatus
   * Stop polling when status is available
   * @param {*} serviceName
   * @param {*} volumeId
   * @param {*} snapshotId
   * @returns
   */
  startSnapshotPolling(serviceName, volumeId, snapshotId) {
    return this.Poller.poll(
      `/storage/netapp/${serviceName}/share/${volumeId}/snapshot/${snapshotId}`,
      {},
      {
        namespace: `snapshot_${serviceName}_${volumeId}_${snapshotId}`,
        interval: FETCH_INTERVAL,
        retryMaxAttempts: 0,
        method: 'get',
        successRule: (data) =>
          data.status === SNAPSHOT_STATUS.AVAILABLE,
        errorRule: (data) =>
          data.status === SNAPSHOT_STATUS.MANAGE_ERROR
      },
    );
  }

  stopSnapshotPolling(serviceName, volumeId, snapshotId) {
    this.Poller.kill({ namespace: `snapshot_${serviceName}_${volumeId}_${snapshotId}` });
  }
  // END POLLING MANAGEMENT FUNCTIONS
}
