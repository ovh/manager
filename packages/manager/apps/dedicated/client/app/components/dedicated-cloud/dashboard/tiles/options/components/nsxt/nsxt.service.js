export default class OptionsNsxtService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getOptionNsxt(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/nsxt`)
      .then(({ data }) => data);
  }

  dataCenterName(serviceName, datacenterId) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/datacenter/${datacenterId}`)
      .then(({ data }) => data.name);
  }
}
