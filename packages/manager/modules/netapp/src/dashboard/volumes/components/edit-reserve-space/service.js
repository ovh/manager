export default class NetAppDashboardEditReserveSpaceService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  modifySnapshotReserveSpace(serviceName, volume, newPercent) {
    return this.$http.put(
      `/storage/netapp/${serviceName}/share/${volume.id}/snapshotReserve`,
      {
        percent: newPercent,
      },
    );
  }

  getSnapshotReserveSpace(serviceName, volume) {
    return this.$http
      .get(`/storage/netapp/${serviceName}/share/${volume.id}/snapshotReserve`)
      .then(({ data }) => data);
  }
}
