export default class {
  /* @ngInject */
  constructor($http, icebergUtils) {
    this.$http = $http;
    this.icebergUtils = icebergUtils;
  }

  getHostHourlyConsumption(serviceName, datacenterId, hostId) {
    return this.$http
      .get(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/hourlyConsumption`,
      )
      .then(({ data }) => data);
  }

  getHostLocation(serviceName, datacenterId, hostId) {
    return this.$http
      .get(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/location`,
      )
      .then(({ data }) => data);
  }

  getPaginatedHosts(serviceName, datacenterId, paginationParams) {
    return this.icebergUtils.icebergQuery(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host`,
      paginationParams,
    );
  }
}
