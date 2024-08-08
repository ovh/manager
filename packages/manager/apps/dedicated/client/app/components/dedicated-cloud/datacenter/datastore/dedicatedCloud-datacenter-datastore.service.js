export default class {
  /* @ngInject */
  constructor(OvhHttp, $http) {
    this.OvhHttp = OvhHttp;
    this.$http = $http;
  }

  fetchLegacyHourlyConsumption(serviceName, datacenterId, filerId) {
    return this.OvhHttp.get(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/hourlyConsumption`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  convertToGlobal(serviceName, datacenterId, filerId) {
    return this.OvhHttp.post(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/convertToGlobal`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  getDatastoreLocation(serviceName, datacenterId, filerId) {
    if (!datacenterId) {
      return this.$http
        .get(`/dedicatedCloud/${serviceName}/filer/${filerId}/location`)
        .then(({ data }) => data);
    }
    return this.$http
      .get(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/location`,
      )
      .then(({ data }) => data);
  }
}
