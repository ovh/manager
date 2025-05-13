export default class OverTheBoxMigrationService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getOfferDetail(serviceName) {
    return this.$http
      .get(`/overTheBox/${serviceName}`)
      .then(({ data }) => data);
  }

  getOffers(serviceName) {
    return this.$http.get(`/overTheBox/${serviceName}/migration/offers`);
  }
}
