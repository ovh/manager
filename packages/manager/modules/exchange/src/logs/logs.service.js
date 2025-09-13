export default class ExchangeLogsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogKinds(organization, productId) {
    return this.$http
      .get(`/email/exchange/${organization}/service/${productId}/log/kind`)
      .then(({ data }) => data);
  }
}
