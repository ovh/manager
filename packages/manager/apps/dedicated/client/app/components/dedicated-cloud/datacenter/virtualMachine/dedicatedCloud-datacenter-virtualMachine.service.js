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

  setLicense(serviceName, datacenterId, vmId, kmsLicense) {
    return this.$http.post(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/setLicense`,
      {
        bypassGuestOsFamilyCheck: false,
        kmsLicense,
      },
    );
  }
}
