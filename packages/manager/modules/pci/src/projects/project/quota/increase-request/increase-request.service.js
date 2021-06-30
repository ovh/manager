import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;
    this.coreConfig = coreConfig;
  }

  createCartAndAssign() {
    return this.$http
      .post('/order/cart', {
        ovhSubsidiary: get(this.coreConfig.getUser(), 'ovhSubsidiary'),
      })
      .then(({ data }) =>
        this.$http.post(`/order/cart/${data.cartId}/assign`).then(() => data),
      );
  }

  orderQuota(projectId, cartId, serviceOption) {
    return this.$http
      .post(`/order/cartServiceOption/cloud/${projectId}`, {
        cartId,
        quantity: 1,
        planCode: serviceOption.planCode,
        duration: serviceOption.prices[0].duration,
        pricingMode: serviceOption.prices[0].pricingMode,
      })
      .then(() =>
        this.$http.post(`/order/cart/${cartId}/checkout`, {
          cartId,
          autoPayWithPreferredPaymentMethod: true,
        }),
      );
  }
}
