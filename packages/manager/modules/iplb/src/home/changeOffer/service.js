export default class IpLoadBalancerChangeOfferService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  getOffersDetails(serviceName, availableOffers) {
    const promises = availableOffers.map(({ planCode }) =>
      this.getOffer(serviceName, planCode),
    );
    return this.$q.all(promises);
  }

  getOffer(serviceName, planCode) {
    return this.$http
      .get(
        `/order/upgrade/ipLoadbalancing/${serviceName}/${planCode}?quantity=1`,
      )
      .then(({ data }) => ({
        ...data,
        planCode,
      }));
  }

  changeOffer(serviceName, planCode) {
    return this.$http
      .post(`/order/upgrade/ipLoadbalancing/${serviceName}/${planCode}`, {
        autoPayWithPreferredPaymentMethod: false,
        quantity: 1,
      })
      .then(({ data }) => data);
  }
}
