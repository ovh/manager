export default class NetAppSnapshotCreateVolumeService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  createVolumeFromSnapshot(
    serviceName,
    name,
    description,
    protocol,
    size,
    snapshotID,
  ) {
    return this.$http.post(`/storage/netapp/${serviceName}/share`, {
      name,
      description,
      protocol,
      size,
      snapshotID,
    });
  }
}
