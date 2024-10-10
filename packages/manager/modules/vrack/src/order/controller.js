export default class VrackOrderCtrl {
  /* @ngInject */
  constructor(VrackOrderService, $window) {
    this.VrackOrderService = VrackOrderService;
    this.$window = $window;
  }

  orderVrack() {
    this.VrackOrderService.order(this.cart.cartId)
      .then((data) => {
        this.$window.open(data.url, '_blank', 'noopener');
        this.goBack();
      })
      .catch((error) => {
        this.error = {
          message: error.data.message,
          queryId: error.headers('X-Ovh-Queryid'),
        };
      });
  }
}
