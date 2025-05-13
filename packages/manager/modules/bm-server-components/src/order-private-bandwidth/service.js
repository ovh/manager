export default class BmServerComponentsOrderPrivateBandwidthService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getBareMetalPrivateBandwidthOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/upgrade`)
      .then(({ data }) => data);
  }

  getBareMetalPrivateBandwidthOrder(serviceId, planCode, params) {
    return this.$http
      .post(`/services/${serviceId}/upgrade/${planCode}/simulate`, params)
      .then(({ data }) => data);
  }

  bareMetalPrivateBandwidthPlaceOrder(serviceId, planCode, params) {
    return this.$http
      .post(`/services/${serviceId}/upgrade/${planCode}/execute`, params)
      .then(({ data }) => data);
  }
}
