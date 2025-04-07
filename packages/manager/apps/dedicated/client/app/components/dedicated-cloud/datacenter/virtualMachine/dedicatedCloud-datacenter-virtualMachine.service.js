export default class {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  deleteLicense(serviceName, datacenterId, vmId) {
    return this.$http.post(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/removeLicense`,
    );
  }
}
