export default class BmServerComponentsOrderPrivateBandwidthService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  getBareMetalPrivateBandwidthOptions(serviceName) {
    return this.$http
      .get(`/order/upgrade/baremetalPrivateBandwidth/${serviceName}`)
      .then(({ data }) => data);
  }

  getBareMetalPrivateBandwidthOrder(serviceName, planCode) {
    return this.$http
      .get(
        `/order/upgrade/baremetalPrivateBandwidth/${serviceName}/${planCode}`,
        {
          params: {
            quantity: 1,
          },
        },
      )
      .then(({ data }) => data);
  }

  bareMetalPrivateBandwidthPlaceOrder(serviceName, planCode, autoPay) {
    return this.$http
      .post(
        `/order/upgrade/baremetalPrivateBandwidth/${serviceName}/${planCode}`,
        {
          quantity: 1,
          autoPayWithPreferredPaymentMethod: autoPay,
        },
      )
      .then(({ data }) => data);
  }
}
