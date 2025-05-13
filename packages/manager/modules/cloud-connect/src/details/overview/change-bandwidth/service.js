export default class ChangeBandwidthService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  loadAvailableOffers(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/upgrade`)
      .then(({ data }) => data);
  }

  upgradeBandwidth(
    planCode,
    serviceId,
    { duration, pricingMode, minimumQuantity },
  ) {
    return this.$http
      .post(`/services/${serviceId}/upgrade/${planCode}/execute`, {
        duration,
        pricingMode,
        quantity: minimumQuantity,
      })
      .then(({ data }) => data);
  }
}
