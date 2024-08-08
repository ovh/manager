export default class {
  /* @ngInject */
  constructor(OvhHttp, $http) {
    this.OvhHttp = OvhHttp;
    this.$http = $http;
  }

  getHostHourlyConsumption(serviceName, datacenterId, hostId) {
    return this.OvhHttp.get(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/hourlyConsumption`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  getHostLocation(serviceName, datacenterId, hostId) {
    return this.$http
      .get(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/location`,
      )
      .then(({ data }) => data);
  }
}
