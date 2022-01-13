export default class BmServerComponentsOrderPrivateBandwidthService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getNutanixClusterPrivateBandwidthOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/upgrade`)
      .then(({ data }) => data);
  }

  getNutanixClusterPrivateBandwidthOrder(serviceId, plan, quantity) {
    return this.$http
      .post(`/services/${serviceId}/upgrade/${plan.planCode}/simulate`, {
        autoPayWithPreferredPaymentMethod: false,
        duration: plan.duration,
        pricingMode: plan.pricingMode,
        quantity,
      })
      .then(({ data }) => data);
  }

  nutanixClusterPrivateBandwidthPlaceOrder(
    serviceId,
    plan,
    quantity,
    autoPayWithPreferredPaymentMethod = false,
  ) {
    return this.$http
      .post(`/services/${serviceId}/upgrade/${plan.planCode}/execute`, {
        autoPayWithPreferredPaymentMethod,
        duration: plan.duration,
        pricingMode: plan.pricingMode,
        quantity,
      })
      .then(({ data }) => data);
  }
}
