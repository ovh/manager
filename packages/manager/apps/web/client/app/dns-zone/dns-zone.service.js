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

  getDnsFile(url) {
    return this.$http.get(url).then(({ data }) => data);
  }

  restore(zoneName, creationDate) {
    return this.$http
      .post(`/domain/zone/${zoneName}/history/${creationDate}/restore`)
      .then(({ data }) => data);
  }
}
