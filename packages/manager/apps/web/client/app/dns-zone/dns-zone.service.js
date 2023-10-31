export default class DNSZoneService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getCapabilities(zoneName) {
    return this.$http
      .get(`/domain/zone/${zoneName}/capabilities`)
      .then(({ data }) => data);
  }

  readDnsFileData(url) {
    return this.$http.get(url).then(({ data }) => data);
  }
}
