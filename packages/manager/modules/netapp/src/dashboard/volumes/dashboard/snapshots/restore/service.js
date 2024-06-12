import { SNAPSHOT_TYPE } from "./constants";

export default class NetAppRestoreVolumeService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  restoreVolume(serviceName, volumeId, snapshot) {
    if (snapshot.type === SNAPSHOT_TYPE.MANUAL) {
      return this.revertVolume(serviceName, volumeId, snapshot.id);
    }
  }

  revertVolume(serviceName, volumeId, snapshotID) {
    return this.$http.post(`/storage/netapp/${serviceName}/share/${volumeId}/revert`, {
      snapshotID
    });
  }
}
