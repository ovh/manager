export default /* @ngInject */ function OvhManagerNetAppDashboardIndex($http) {
  this.updateStorage = function updateStorage(storageId, name) {
    return $http.put(`/storage/netapp/${storageId}`, {
      name,
    });
  };
}
