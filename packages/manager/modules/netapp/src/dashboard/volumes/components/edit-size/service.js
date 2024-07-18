export default class NetAppDashboardEditSizeService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  modifySize(serviceName, volume, newSize) {
    if (newSize > volume.size) {
      return this.$http.post(
        `/storage/netapp/${serviceName}/share/${volume.id}/extend`,
        {
          size: newSize,
        },
      );
    }
    return this.$http.post(
      `/storage/netapp/${serviceName}/share/${volume.id}/shrink`,
      {
        size: newSize,
      },
    );
  }
}
