export default class ServiceService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getBillsIds(serviceId) {
    return this.$http.get(`/services/${serviceId}/billing/invoices`);
  }
}
