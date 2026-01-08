export default class ExchangePrivateConfigFunnelService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getZones() {
    return this.$http.get('/domain/zone').then(({ data }) => data);
  }

  postChangeHostname(organizationName, exchangeService, body) {
    return this.$http.post(`/email/exchange/${organizationName}/service/${exchangeService}/changeHostname`, body).then(({ data }) => data);
  }
}
