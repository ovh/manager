export default class vrackOrderService {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;
    this.user = coreConfig.getUser();
  }

  createCartWithOneVrack() {
    let cartId;
    return this.createCart()
      .then(({ data: addVrackData }) => {
        cartId = addVrackData.cartId;
        return this.assignCart(cartId);
      })
      .then(() => this.addVrackToCart(cartId));
  }

  createCart() {
    return this.$http.post('/order/cart', {
      ovhSubsidiary: this.user.ovhSubsidiary,
    });
  }

  addVrackToCart(cartId) {
    return this.$http.post(`/order/cart/${cartId}/vrack`, {
      duration: 'P1M',
      planCode: 'vrack',
      pricingMode: 'default',
      quantity: 1,
    });
  }

  assignCart(cartId) {
    return this.$http.post(`/order/cart/${cartId}/assign`);
  }

  deleteCart(cartId) {
    return this.$http.delete(`/order/cart/${cartId}`);
  }

  getContracts(cartId) {
    return this.$http
      .get(`/order/cart/${cartId}/checkout`)
      .then(({ data }) => data);
  }

  order(cartId, withPaymentMethod = true) {
    return this.$http
      .post(`/order/cart/${cartId}/checkout`, {
        autoPayWithPreferredPaymentMethod: withPaymentMethod,
        waiveRetractationPeriod: true,
      })
      .then(({ data }) => data);
  }
}
